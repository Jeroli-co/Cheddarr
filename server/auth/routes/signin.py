from http import HTTPStatus
from flask import url_for, redirect
from flask_dance.consumer import oauth_authorized, oauth_error
from flask_login import login_user, login_required
from sqlalchemy.orm.exc import NoResultFound
from server import InvalidUsage, db
from server.auth import auth, facebook_bp, google_bp, utils
from server.auth.models import User, OAuth
from server.auth.forms import SigninForm


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if not signin_form.validate():
        raise InvalidUsage(
            "Error in signin form.",
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
            "Account needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED
        )

    remember = True if signin_form.remember.data else False
    login_user(user, remember=remember)
    return utils.get_session_info(), HTTPStatus.OK


@auth.route("/refresh-session")
@login_required
def refresh_session():
    return utils.get_session_info(), HTTPStatus.OK


@auth.route("/sign-in/google")
def signin_google():
    return redirect(url_for("google.login")), HTTPStatus.OK


@auth.route("/sign-in/facebook")
def signin_facebook():
    return redirect(url_for("facebook.login")), HTTPStatus.OK


# create/login local user on successful OAuth facebook login
@oauth_authorized.connect_via(facebook_bp)
@oauth_authorized.connect_via(google_bp)
def oauth_logged_in(blueprint, token):
    if not token:
        return False

    if blueprint.name == "facebook":
        resp = blueprint.session.get("/me?fields=email,first_name,last_name")
    elif blueprint.name == "google":
        resp = blueprint.session.get("/oauth2/v1/userinfo")
    else:
        return False

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
        print(info)
        email = info["email"]
        user = User.find(email=email)
        # If the user already exists in the User table (but not in the Oauth table)
        if user:
            # Associate the existing local user account with the OAuth token
            oauth.user = user
            # Log in the existing local user account
            login_user(oauth.user)
        else:
            # Get user info
            if blueprint.name == "facebook":
                first_name = info["first_name"]
                last_name = info["last_name"]
            elif blueprint.name == "google":
                first_name = info["given_name"]
                last_name = info["family_name"]
            else:
                return False
            # Create a new local user account for this user
            user = User.create_user(
                first_name=first_name, last_name=last_name, email=email, username=email,
            )
            # Associate the new local user account with the OAuth token
            oauth.user = user
            # Log in the new local user account
            login_user(user)
        # Save and commit our database models
        db.session.add_all([user, oauth])
        db.session.commit()

    # Disable Flask-Dance's default behavior for saving the OAuth token
    return False


# notify on OAuth provider error
@oauth_error.connect_via(facebook_bp)
@oauth_error.connect_via(google_bp)
def oauth_error(blueprint, message, response):
    raise InvalidUsage(
        "OAuth error from {name}! "
        "message={message} response={response}".format(
            name=blueprint.name, message=message, response=response
        ),
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
    )
