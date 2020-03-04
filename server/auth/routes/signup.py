from http import HTTPStatus

from itsdangerous import URLSafeSerializer
from flask import current_app as app, url_for, render_template

from server import db, InvalidUsage
from server.auth import auth, User
from server.auth.forms import SignupForm, EmailForm
from server.auth.utils import generate_confirmation_token, send_email, confirm_token


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
            db.session.add(user)
            db.session.commit()
            send_email(user.email, subject, html)
            return {"message": "Confirmation email sent"}, HTTPStatus.OK

        raise InvalidUsage("The user already exists.", status_code=HTTPStatus.CONFLICT)
    raise InvalidUsage("Error in signup form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                       payload=signup_form.errors)


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

