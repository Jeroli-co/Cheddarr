from http import HTTPStatus

from flask import request, redirect, url_for
from flask_login import login_user, current_user
from requests import get, post
from sqlalchemy.orm.exc import NoResultFound

from server import db, InvalidUsage, utils
from server.auth import auth
from server.auth.models import ApiKey, Oauth, User
from server.auth.forms import SigninForm
from server.auth.serializers.auth_serializer import session_serializer
from server.config import FLASK_APP

plex_identifier = utils.generate_api_key()
plex_headers = {
    "X-Plex-Client-Identifier": plex_identifier,
    "X-Plex-Product": FLASK_APP,
    "Accept": "application/json",
}


@auth.route("/sign-in/", methods=["GET", "POST"])
def signin():
    if request.method == "GET":
        if current_user.is_authenticated:
            return session_serializer.dump(current_user), HTTPStatus.OK
        else:
            raise InvalidUsage(
                "User not authenticated", status_code=HTTPStatus.UNAUTHORIZED
            )

    else:
        signin_form = SigninForm()
        if not signin_form.validate():
            raise InvalidUsage(
                "Error while signing in.",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                payload=signin_form.errors,
            )

        user = User.find(email=signin_form.usernameOrEmail.data) or User.find(
            username=signin_form.usernameOrEmail.data
        )
        if not user or not user.check_password(signin_form.password.data):
            raise InvalidUsage(
                "Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST
            )

        if not user.confirmed:
            raise InvalidUsage(
                "The email needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED,
            )

        remember = signin_form.remember.data if signin_form.remember else False
        login_user(user, remember=remember)
        return session_serializer.dump(user), HTTPStatus.OK


@auth.route("/sign-in/plex/", methods=["GET"])
def plex_signin():
    r = post("https://plex.tv/api/v2/pins?strong=true", headers=plex_headers)
    info = r.json()
    code = info["code"]
    state = info["id"]
    authorize_url = (
        "https://app.plex.tv/auth#?clientID="
        + plex_identifier
        + "&code="
        + code
        + "&forwardUrl="
        + url_for("auth.authorize_plex", _external=True).replace("/api", "")
        + "?id="
        + str(state)
    )
    return redirect(authorize_url), HTTPStatus.OK


@auth.route("/plex/authorize/", methods=["GET"])
def authorize_plex():
    state = request.args.get("id")
    r = get("https://plex.tv/api/v2/pins/" + state, headers=plex_headers)
    auth_token = r.json().get("authToken")
    if not auth_token:
        raise InvalidUsage(
            "Error while authorizing Plex", status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
    plex_headers["X-Plex-Token"] = auth_token
    r = get("https://plex.tv/users/account.json", headers=plex_headers)
    info = r.json().get("user")
    user_id = info["id"]

    # Find this OAuth user in the database, or create it
    query = Oauth.query.filter_by(provider_user_id=user_id)
    try:
        oauth = query.one()
    except NoResultFound:
        oauth = Oauth(provider_user_id=user_id)

    if not oauth.user:
        email = info["email"]
        user = User.find(email=email)
        # If the user does not exist we create him
        if not user:
            username = info["username"]
            user_picture = info["thumb"]
            user = User(
                username=username,
                email=email,
                password=utils.generate_password(),
                user_picture=user_picture,
                confirmed=True,
            )
        # Create the Plex API key (auth token)
        api_key = ApiKey(user_id=user.id, provider="plex", key=auth_token)
        # Associate the local user account with the OAuth table and the ApiKey table
        oauth.user = user
        api_key.user = user
        print(user)

        # Save and commit our database models
        db.session.add_all([user, oauth, api_key])
        db.session.commit()
    # Log in the user (new or existing)
    login_user(oauth.user)
    return session_serializer.dump(oauth.user), HTTPStatus.OK
