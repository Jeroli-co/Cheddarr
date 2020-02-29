from http import HTTPStatus

from flask import current_app as app, render_template, url_for
from flask_login import current_user, login_required, login_user, logout_user, fresh_login_required
from itsdangerous import URLSafeSerializer, URLSafeTimedSerializer

from server import db, InvalidUsage
from server.auth import auth
from server.auth.models import SigninForm, SignupForm, User, ChangePasswordForm
from server.auth.utils import get_session_info, generate_confirmation_token, send_email


@auth.route("/sign-up", methods=["POST"])
def signup():
    serializer = URLSafeSerializer(app.secret_key)
    signup_form = SignupForm()
    if signup_form.validate():
        existing_user = (
            db.session.query(User.id).filter_by(email=signup_form.email.data).scalar()
        )
        if existing_user is None:
            user = User(
                username=signup_form.username.data,
                email=signup_form.email.data,
                password=signup_form.password.data,
                first_name=signup_form.firstName.data,
                last_name=signup_form.lastName.data,
                confirmed=False,
            )
            user.session_token = serializer.dumps(user.password, salt=app.config.get("SECURITY_PASSWORD_SALT"))

            token = generate_confirmation_token(user.email)
            confirm_url = url_for("auth.confirm_email", token=token, _external=True)
            html = render_template("email/account_confirmation.html", confirm_url=confirm_url.replace("/api", ""))
            subject = "Please confirm your email"
            send_email(user.email, subject, html)

            db.session.add(user)
            db.session.commit()

            return {"message": "User added."}, HTTPStatus.CREATED
        raise InvalidUsage("The user already exists.", status_code=HTTPStatus.CONFLICT)
    raise InvalidUsage("Error in signup form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=signup_form.errors)


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if signin_form.validate():
        user = (
                User.query.filter_by(email=signin_form.usernameOrEmail.data).first()
                or User.query.filter_by(username=signin_form.usernameOrEmail.data).first()
        )
        if user:
            if user.confirmed:
                if user.check_password(signin_form.password.data):
                    login_user(user, remember=True if signin_form.remember.data else False)
                    return get_session_info(), HTTPStatus.OK
            raise InvalidUsage("Account needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED)
        raise InvalidUsage("Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST)
    raise InvalidUsage("Error in signin form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=signin_form.errors)


@auth.route("/sign-out", methods=["GET"])
@login_required
def signout():
    logout_user()
    return {"message": "User signed out"}, HTTPStatus.OK


@auth.route("/refresh-session")
@login_required
def refresh_session():
    return get_session_info(), HTTPStatus.OK


@auth.route("/change-password")
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if password_form.validate():
        current_user.password = password_form.newPassword.data
        db.session.commit()
        return refresh_session()
    raise InvalidUsage("Error in change password form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=password_form.errors)


@auth.route('/confirm/<token>')
def confirm_email(token):
    serializer = URLSafeTimedSerializer(app.secret_key)
    try:
        email = serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=3600  # seconds
        )
    except:
        raise InvalidUsage("The confirmation link is invalid or has expired.", status_code=HTTPStatus.GONE)
    user = User.query.filter_by(email=email).first()
    if user.confirmed:
        raise InvalidUsage("The account is already confirmed.", HTTPStatus.CONFLICT)
    user.confirmed = True
    db.session.commit()

    return {"message": "Account confirmed"}, HTTPStatus.OK
