from http import HTTPStatus

from flask import url_for, redirect, current_app
from flask_dance.consumer import oauth_authorized, oauth_error
from flask_dance.contrib.facebook import facebook
from flask_login import login_user, login_required
from sqlalchemy.orm.exc import NoResultFound

from server import InvalidUsage, db
from server.auth import auth, facebook_bp
from server.auth.models import User, OAuth
from server.auth.forms import SigninForm, SignupForm
from server.auth.utils import get_session_info, create_user


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if not signin_form.validate():
        raise InvalidUsage("Error in signin form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                           payload=signin_form.errors)

    user = (
            User.find(email=signin_form.usernameOrEmail.data)
            or User.find(username=signin_form.usernameOrEmail.data)
    )
    if not user or not user.check_password(signin_form.password.data):
        raise InvalidUsage("Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST)

    if not user.confirmed:
        raise InvalidUsage("Account needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED)

    remember = True if signin_form.remember.data else False
    login_user(user, remember=remember)
    return get_session_info(), HTTPStatus.OK


@auth.route("/refresh-session")
@login_required
def refresh_session():
    return get_session_info(), HTTPStatus.OK


@auth.route("/sign-in/facebook")
def signin_facebook():
    return redirect(url_for("facebook.login")), HTTPStatus.OK


# create/login local user on successful OAuth login
@oauth_authorized.connect_via(facebook_bp)
def facebook_logged_in(blueprint, token):
    if not token:
        return False

    resp = blueprint.session.get("/me", params={"fields": "email, first_name, last_name"})
    if not resp.ok:
        return False

    info = resp.json()
    user_id = info["id"]

    # Find this OAuth token in the database, or create it
    query = OAuth.query.filter_by(provider=blueprint.name, provider_user_id=user_id)
    try:
        oauth = query.one()
    except NoResultFound:
        oauth = OAuth(provider=blueprint.name, provider_user_id=user_id, token=token)

    if oauth.user:
        login_user(oauth.user)

    else:
        # Create a new local user account for this user
        print(info)

        user = create_user(
            first_name=info["first_name"],
            last_name=info["last_name"],
            email=info["email"],
            username=info["email"],
        )
        print(user)
        # Associate the new local user account with the OAuth token
        oauth.user = user
        # Save and commit our database models
        db.session.add_all([user, oauth])
        db.session.commit()
        # Log in the new local user account
        login_user(user)

    # Disable Flask-Dance's default behavior for saving the OAuth token
    return False


# notify on OAuth provider error
@oauth_error.connect_via(facebook_bp)
def facebook_error(blueprint, message, response):
    raise InvalidUsage("OAuth error from {name}! " "message={message} response={response}".format(
        name=blueprint.name, message=message, response=response
    ), status_code=HTTPStatus.INTERNAL_SERVER_ERROR)
