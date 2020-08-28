from flask import make_response, redirect, url_for
from flask_login import (
    current_user,
    fresh_login_required,
    login_required,
    login_user,
    logout_user,
)
from passlib import pwd
from requests import get, post
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import (
    BadRequest,
    Conflict,
    Forbidden,
    Gone,
    InternalServerError,
    Unauthorized,
)

from server import utils
from server.auth.models import User
from server.auth.schemas import PlexAuthSchema, SigninSchema, UserSchema
from server.config import (
    APP_NAME,
    PLEX_ACCESS_TOKEN_URL,
    PLEX_AUTHORIZE_URL,
    PLEX_CLIENT_IDENTIFIER,
    PLEX_REQUEST_TOKEN_URL,
    PLEX_USER_RESOURCE_URL,
)
from server.extensions import limiter
from server.extensions.marshmallow import form, query
from server.providers.plex.models import PlexConfig
from server.tasks import send_email

plex_headers = {
    "X-Plex-Client-Identifier": PLEX_CLIENT_IDENTIFIER,
    "X-Plex-Product": APP_NAME,
    "Accept": "application/json",
}

session_serializer = UserSchema(only=["username", "avatar"])


@limiter.limit("10/hour")
@form(UserSchema, only=["username", "password", "email", "avatar"])
def signup(username, password, email, avatar):
    existing_email = User.exists(email=email)
    if existing_email:
        raise Conflict("This email is already taken.")

    existing_username = User.exists(username=username)
    if existing_username:
        raise Conflict("This username is not available.")

    user = User(
        username=username,
        email=email,
        password=password,
        avatar=avatar,
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


@form(SigninSchema)
def signin(usernameOrEmail, password, remember):
    user = User.find(email=usernameOrEmail) or User.find(username=usernameOrEmail)
    if not user or not user.password == password:
        raise BadRequest("Wrong username/email or password.")

    if not user.confirmed:
        raise Unauthorized("The email needs to be confirmed.")

    remember = remember if remember else False
    login_user(user, remember=remember)
    return session_serializer.jsonify(user)


@query(PlexAuthSchema)
def signin_plex(redirectURI):
    r = post(PLEX_REQUEST_TOKEN_URL, headers=plex_headers)
    info = r.json()
    code = info["code"]
    state = info["id"]
    forward_url = url_for("auth.authorize_plex", _external=True).replace("/api", "")
    token = utils.generate_token({"id": str(state), "redirectURI": redirectURI})
    authorize_url = (
        PLEX_AUTHORIZE_URL
        + "?clientID="
        + PLEX_CLIENT_IDENTIFIER
        + "&code="
        + code
        + "&forwardUrl="
        + forward_url
        + "?token="
        + token
    )
    return redirect(authorize_url), 200


@query(PlexAuthSchema)
def authorize_plex(token, redirectURI):
    token = utils.confirm_token(token)
    state = token.get("id")
    r = get(PLEX_ACCESS_TOKEN_URL + state, headers=plex_headers)
    auth_token = r.json().get("authToken")
    if not auth_token:
        raise InternalServerError("Error while authorizing Plex.")

    plex_headers["X-Plex-Token"] = auth_token
    r = get(PLEX_USER_RESOURCE_URL, headers=plex_headers)
    info = r.json().get("user")
    user_id = info["id"]

    # Find this OAuth user in the database, or create it
    try:
        plex_config = PlexConfig.query.filter_by(plex_user_id=user_id).one()
    except NoResultFound:
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


@login_required
def signout():
    logout_user()
    return {"message": "User signed out"}


@fresh_login_required
def get_api_key():
    return {"key": current_user.api_key}


@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    current_user.save()
    return {"message": "API key deleted"}


@limiter.limit("3/hour")
@fresh_login_required
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    current_user.save()
    return {"key": current_user.api_key}
