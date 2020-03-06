from http import HTTPStatus

from flask import url_for, current_app as app
from flask_login import login_user, login_required

from server import InvalidUsage, oauth
from server.auth import auth
from server.auth.models import User
from server.auth.forms import SigninForm
from server.auth.utils import get_session_info


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if signin_form.validate():
        user = (
                User.find(email=signin_form.usernameOrEmail.data)
                or User.find(username=signin_form.usernameOrEmail.data)
        )
        if user:
            if user.confirmed:
                if user.check_password(signin_form.password.data):
                    remember = True if signin_form.remember.data else False
                    login_user(user, remember=remember)
                    return get_session_info(), HTTPStatus.OK

            raise InvalidUsage("Account needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED)
        raise InvalidUsage("Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST)
    raise InvalidUsage("Error in signin form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=signin_form.errors)


@auth.route("/refresh-session")
@login_required
def refresh_session():
    return get_session_info(), HTTPStatus.OK


@auth.route("/sign-in/google")
def signin_google():
    redirect_uri = "https://tolocalhost.com/"
    #redirect_uri = url_for('auth.authorize_facebook', _external=True).replace("/api", "")
    res = oauth.google.authorize_redirect(redirect_uri)
    res.status_code = 200
    return res


@auth.route('/authorize/google')
def authorize_google():
    token = oauth.google.authorize_access_token()
    resp = oauth.google.parse_id_token(token)
    return get_session_info(), HTTPStatus.OK


@auth.route("/sign-in/facebook")
def signin_facebook():
    redirect_uri = url_for('auth.authorize_facebook', _external=True).replace("/api", "")
    res = oauth.facebook.authorize_redirect(redirect_uri)
    res.status_code = 200
    return res


@auth.route('/authorize/facebook')
def authorize_facebook():
    print(app.config.get('FACEBOOK_ACCESS_TOKEN_URL'))
    token = oauth.facebook.authorize_access_token()
    resp = oauth.facebook.parse_id_token(token)
    return get_session_info(), HTTPStatus.OK
