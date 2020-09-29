from flask import make_response, redirect, url_for, Blueprint
from flask_login import (
    current_user,
    login_required,
    login_user,
    logout_user,
)
from passlib import pwd
from requests import get
from werkzeug.exceptions import (
    BadRequest,
    Conflict,
    Forbidden,
    Gone,
    InternalServerError,
    Unauthorized,
)

from server import utils
from server.config import (
    APP_NAME,
    PLEX_AUTHORIZE_URL,
    PLEX_CLIENT_IDENTIFIER,
    PLEX_TOKEN_URL,
    PLEX_USER_RESOURCE_URL,
)
from server.extensions import limiter
from server.extensions.marshmallow import body, form, query, jsonify_with
from server.models import PlexConfig, User
from server.schemas import (
    UserSchema,
    SigninSchema,
    ConfirmPlexSigninSchema,
    AuthorizePlexSigninSchema,
)
from server.tasks import send_email
from server.utils import make_url

auth_bp = Blueprint("auth", __name__)
session_serializer = UserSchema(only=["username", "avatar"])


@auth_bp.route("/sign-up/", methods=["POST"])
@limiter.limit("10/hour")
@form(UserSchema, only=["username", "email", "password"])
def signup(username, password, email):
    existing_email = User.exists(email=email)
    if existing_email:
        raise Conflict("This email is already taken.")

    existing_username = User.exists(username=username)
    if existing_username:
        raise Conflict("This username is not available.")

    user = User(
        username=username, email=email, password=password, avatar=utils.random_avatar()
    )

    token = utils.generate_timed_token(user.email)
    send_email.delay(
        user.email,
        "Welcome!",
        "email/welcome.html",
        {
            "username": user.username,
            "confirm_url": url_for("auth.confirm_email", token=token, _external=True),
        },
    )
    user.save()
    return {"message": "Confirmation email sent."}


@auth_bp.route("/sign-up/confirm/<token>/")
def confirm_email(token):
    try:
        email = utils.confirm_timed_token(token)
    except Exception:
        raise Gone("The confirmation link is invalid or has expired.")

    user = User.find(email=email)
    if not user and not current_user.is_authenticated:
        raise Unauthorized("Need to sign in to confirm email change.")

    if user and user.confirmed:
        raise Forbidden("This email is already confirmed.")
    if current_user.is_authenticated and current_user.confirmed:
        current_user.change_email(email)
    else:
        user.confirmed = True
        user.save()
    return {"message": "The email is now confirmed."}


@auth_bp.route("/sign-up/resend/", methods=["POST"])
@limiter.limit("10/hour")
@form(UserSchema, only=["email"])
def resend_confirmation(email):
    existing_user = User.exists(email=email)
    if not existing_user:
        raise BadRequest("No user with this email exists.")

    token = utils.generate_timed_token(email)
    send_email.delay(
        email,
        "Please confirm your email",
        "email/email_confirmation.html",
        {"confirm_url": url_for("auth.confirm_email", token=token, _external=True)},
    )
    return {"message": "Confirmation email sent."}


@auth_bp.route("/sign-in/", methods=["POST"])
@form(SigninSchema)
@jsonify_with(session_serializer)
def signin(usernameOrEmail, password, remember):
    user = User.find(email=usernameOrEmail) or User.find(username=usernameOrEmail)
    if not user or not user.password == password:
        raise BadRequest("Wrong username/email or password.")

    if not user.confirmed:
        raise Unauthorized("The email needs to be confirmed.")

    remember = remember if remember else False
    login_user(user, remember=remember)
    return user


@auth_bp.route("/sign-out/")
@login_required
def signout():
    logout_user()
    return {"message": "User signed out"}


@auth_bp.route("/sign-in/plex/")
def start_signin_plex():
    request_pin_url = make_url(
        PLEX_TOKEN_URL,
        queries_dict={
            "strong": "true",
            "X-Plex-Product": APP_NAME,
            "X-Plex-Client-Identifier": PLEX_CLIENT_IDENTIFIER,
        },
    )
    return request_pin_url


@auth_bp.route("/sign-in/plex/authorize/", methods=["POST"])
@body(AuthorizePlexSigninSchema)
def authorize_signin_plex(args):
    key = args["key"]
    code = args["code"]
    redirectURI = args["redirectURI"]
    forward_url = url_for("auth.confirm_signin_plex", _external=True).replace(
        "/api", ""
    )
    token = utils.generate_token(
        {"id": str(key), "code": str(code), "redirectURI": redirectURI}
    )
    authorize_url = (
        make_url(
            PLEX_AUTHORIZE_URL,
            queries_dict={
                "context[device][product]": APP_NAME,
                "clientID": PLEX_CLIENT_IDENTIFIER,
                "code": code,
                "forwardUrl": forward_url,
            },
        )
        + "?token="
        + token
    )
    return redirect(authorize_url), 200


@auth_bp.route("/sign-in/plex/confirm/")
@query(ConfirmPlexSigninSchema)
def confirm_signin_plex(token):
    token = utils.confirm_token(token)
    state = token.get("id")
    code = token.get("code")
    redirectURI = token.get("redirectURI", "")
    access_url = make_url(
        PLEX_TOKEN_URL + state,
        queries_dict={"code": code, "X-Plex-Client-Identifier": PLEX_CLIENT_IDENTIFIER},
    )
    r = get(access_url, headers={"Accept": "application/json"})
    auth_token = r.json().get("authToken")
    if not auth_token:
        raise InternalServerError("Error while authorizing Plex.")

    r = get(
        PLEX_USER_RESOURCE_URL,
        headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
    )
    info = r.json()
    user_id = info["id"]

    # Find this OAuth user in the database, or create it
    plex_config = PlexConfig.find(plex_user_id=user_id)
    if not plex_config:
        plex_config = PlexConfig(plex_user_id=user_id, api_key=auth_token)
    if not plex_config.user:
        email = info["email"]
        user = User.find(email=email)
        # If the user does not exist we create him
        if not user:
            username = info["username"]
            avatar = info["thumb"]
            user = User(
                username=username,
                email=email,
                password=pwd.genword(entropy=56),
                avatar=avatar,
                confirmed=True,
            )
        # The user is considered confirmed if he signs in with Plex
        user.confirmed = True
        # Associate the API key (possibly new at each login)
        plex_config.api_key = auth_token
        # Associate the local user account with the ProviderConfig (Plex) table
        plex_config.user = user

        # Save and commit our database models
        user.save()
        plex_config.save()
    # Log in the user (new or existing)
    login_user(plex_config.user)
    res = make_response(session_serializer.jsonify(plex_config.user))
    res.headers["redirect-uri"] = redirectURI
    return res