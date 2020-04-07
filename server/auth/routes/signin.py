from http import HTTPStatus

from flask import make_response, redirect, request, url_for
from flask_login import current_user, login_user
from passlib import pwd
from requests import get, post
from sqlalchemy.orm.exc import NoResultFound

from server import utils
from server.auth.forms import SigninForm
from server.auth.models import User
from server.auth.routes import auth
from server.auth.serializers.auth_serializer import session_serializer
from server.config import (
    APP_NAME,
    PLEX_ACCESS_TOKEN_URL,
    PLEX_AUTHORIZE_URL,
    PLEX_REQUEST_TOKEN_URL,
    PLEX_USER_RESOURCE_URL,
)
from server.exceptions import HTTPError
from server.extensions import db
from server.providers.models import PlexConfig

plex_identifier = utils.generate_api_key()
plex_headers = {
    "X-Plex-Client-Identifier": plex_identifier,
    "X-Plex-Product": APP_NAME,
    "Accept": "application/json",
}


@auth.route("/sign-in/", methods=["GET", "POST"])
def signin():
    if request.method == "GET":
        if current_user.is_authenticated:
            return session_serializer.jsonify(current_user), HTTPStatus.OK
        else:
            raise HTTPError(
                "User not authenticated", status_code=HTTPStatus.UNAUTHORIZED
            )

    else:
        signin_form = SigninForm()
        if not signin_form.validate():
            raise HTTPError(
                "Error while signing in.",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                payload=signin_form.errors,
            )

        user = User.find(email=signin_form.usernameOrEmail.data) or User.find(
            username=signin_form.usernameOrEmail.data
        )
        if not user or not user.password == signin_form.password.data:
            raise HTTPError(
                "Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST
            )

        if not user.confirmed:
            raise HTTPError(
                "The email needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED,
            )

        remember = signin_form.remember.data if signin_form.remember else False
        login_user(user, remember=remember)
        return session_serializer.jsonify(user), HTTPStatus.OK


@auth.route("/sign-in/plex/", methods=["GET"])
def plex_signin():
    redirect_uri = request.args.get("redirectURI", "")
    r = post(PLEX_REQUEST_TOKEN_URL, headers=plex_headers)
    info = r.json()
    code = info["code"]
    state = info["id"]
    forward_url = url_for("auth.authorize_plex", _external=True).replace("/api", "")
    token = utils.generate_token({"id": str(state), "redirectURI": redirect_uri})
    authorize_url = (
        PLEX_AUTHORIZE_URL
        + "?clientID="
        + plex_identifier
        + "&code="
        + code
        + "&forwardUrl="
        + forward_url
        + "?token="
        + token
    )
    return redirect(authorize_url), HTTPStatus.OK


@auth.route("/plex/authorize/", methods=["GET"])
def authorize_plex():
    token = request.args.get("token")
    token = utils.confirm_token(token)
    redirect_uri = token.get("redirectURI")
    state = token.get("id")
    r = get(PLEX_ACCESS_TOKEN_URL + state, headers=plex_headers)
    auth_token = r.json().get("authToken")
    if not auth_token:
        raise HTTPError(
            "Error while authorizing Plex", status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
    plex_headers["X-Plex-Token"] = auth_token
    r = get(PLEX_USER_RESOURCE_URL, headers=plex_headers)
    info = r.json().get("user")
    user_id = info["id"]

    # Find this OAuth user in the database, or create it
    query = PlexConfig.query.filter_by(plex_user_id=user_id)
    try:
        plex_config = query.one()
    except NoResultFound:
        plex_config = PlexConfig(plex_user_id=user_id)

    if not plex_config.user:
        email = info["email"]
        user = User.find(email=email)
        # If the user does not exist we create him
        if not user:
            username = info["username"]
            user_picture = info["thumb"]
            user = User(
                username=username,
                email=email,
                password=pwd.genword(entropy=56),
                user_picture=user_picture,
                confirmed=True,
            )

        # Associate the API key (auth token)
        plex_config.provider_api_key = auth_token
        # Associate the local user account with the ProviderConfig (Plex) table
        plex_config.user = user

        # Save and commit our database models
        db.session.add_all([user, plex_config])
        db.session.commit()
    # Log in the user (new or existing)
    login_user(plex_config.user)
    res = make_response(session_serializer.jsonify(plex_config.user))
    res.headers["redirect-uri"] = redirect_uri
    return res
