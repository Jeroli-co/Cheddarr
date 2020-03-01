from http import HTTPStatus

from flask import current_app as app, render_template, url_for, make_response
from flask_login import current_user, login_required, login_user, logout_user
from itsdangerous import URLSafeSerializer

from server import db, InvalidUsage
from server.auth import auth
from server.auth.models import User
from server.auth.forms import SignupForm, SigninForm, ChangePasswordForm, EmailForm
from server.auth.utils import get_session_info, generate_confirmation_token, send_email, confirm_token


@auth.route("/sign-up", methods=["POST"])
def signup():
    serializer = URLSafeSerializer(app.secret_key)
    signup_form = SignupForm()
    if signup_form.validate():
        existing_user = User.exists(email=signup_form.email.data)
        if existing_user is None:
            user = User(
                username=signup_form.username.data.lower(),
                email=signup_form.email.data,
                password=signup_form.password.data,
                first_name=signup_form.firstName.data,
                last_name=signup_form.lastName.data,
                confirmed=False,
            )
            user.session_token = serializer.dumps(user.password, salt=app.config.get("SECURITY_PASSWORD_SALT"))

            token = generate_confirmation_token(user.email)
            confirm_url = url_for("auth.confirm_email", token=token, _external=True)
            html = render_template("email/welcome.html", username=user.username, confirm_url=confirm_url.replace("/api", ""))
            subject = "Welcome!"
            send_email(user.email, subject, html)
            return {"message": "Confirmation email sent"}, HTTPStatus.OK

            db.session.add(user)
            db.session.commit()

            return send_email_confirmation(user.email)
        raise InvalidUsage("The user already exists.", status_code=HTTPStatus.CONFLICT)
    raise InvalidUsage("Error in signup form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=signup_form.errors)


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if signin_form.validate():
        user = (
                User.find(email=signin_form.usernameOrEmail.data)
                or User.find(username=signin_form.usernameOrEmail.data.lower())
        )
        if user:
            if user.confirmed:
                if user.check_password(signin_form.password.data):
                    remember = True if signin_form.remember.data else False
                    login_user(user, remember=remember)
                    return make_response(get_session_info(), HTTPStatus.OK)

            raise InvalidUsage("Account needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED)
        raise InvalidUsage("Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST)
    raise InvalidUsage("Error in signin form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=signin_form.errors)


@auth.route("/sign-out", methods=["GET"])
@login_required
def signout():
    logout_user()
    return {"message": "User signed out"}, HTTPStatus.OK


@auth.route("/reset/password")
def reset_password():
    email_form = EmailForm()
    if email_form.validate():
        email = email_form.email.data
        existing_user = User.user_exists(email)
        if existing_user:
            token = generate_confirmation_token(email)
            reset_url = url_for("auth.confirm_reset", token=token, _external=True)
            html = render_template("email/reset_password_instructions.html", reset_url=reset_url.replace("/api", ""))
            subject = "Please confirm your email"
            send_email(email, subject, html)
            return {"message": "Reset instructions sent."}, HTTPStatus.OK
    raise InvalidUsage("Error in email form", status_code=HTTPStatus.INTERNAL_SERVER_ERROR, payload=email_form.errors)


@auth.route("/reset/<token>", methods=["GET", "POST"])
def confirm_reset(token):
    try:
        email = confirm_token(token)
    except:
        raise InvalidUsage("The reset link is invalid or has expired.", status_code=HTTPStatus.GONE)
    user = User.find(email=email)
    user.confirmed = False
    db.commit()

    password_form = ChangePasswordForm()
    if password_form.validate():
        current_user.password = password_form.newPassword.data
        db.session.commit()
        return refresh_session()
    raise InvalidUsage("Error in change password form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=password_form.errors)


@auth.route('/confirm/<token>')
def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        raise InvalidUsage("The confirmation link is invalid or has expired.", status_code=HTTPStatus.GONE)
    user = User.find(email=email)
    if user and user.confirmed:
        raise InvalidUsage("The account is already confirmed.", HTTPStatus.CONFLICT)
    user.confirmed = True
    db.session.commit()
    return {"message": "Account confirmed"}, HTTPStatus.CREATED


@auth.route('/confirm/resend')
def resend_confirmation():
    email_form = EmailForm()
    if email_form.validate():
        email = email_form.email.data
        token = generate_confirmation_token(email)
        confirm_url = url_for("auth.confirm_email", token=token, _external=True)
        html = render_template("email/account_confirmation.html", confirm_url=confirm_url.replace("/api", ""))
        subject = "Please confirm your email"
        send_email(email, subject, html)
        return {"message": "Confirmation email sent"}, HTTPStatus.OK
    raise InvalidUsage("Cannot resend confirmation email", status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


@auth.route("/refresh-session")
@login_required
def refresh_session():
    return get_session_info(), HTTPStatus.OK
