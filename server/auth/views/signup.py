from http import HTTPStatus

from flask import render_template, url_for
from flask_login import current_user

from server import utils
from server.auth import auth
from server.auth.forms import EmailForm, SignupForm
from server.auth.models import User
from server.exceptions import HTTPError
from server.extensions import db, limiter
from server.tasks import send_email


@auth.route("/sign-up/", methods=["POST"])
@limiter.limit("10/hour")
def signup():
    signup_form = SignupForm()
    if not signup_form.validate():
        raise HTTPError(
            "Error while signing up.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=signup_form.errors,
        )

    existing_email = User.exists(email=signup_form.email.data)
    if existing_email:
        raise HTTPError("This email is already taken.", status_code=HTTPStatus.CONFLICT)

    existing_username = User.exists(username=signup_form.username.data)
    if existing_username:
        raise HTTPError(
            "This username is not available.", status_code=HTTPStatus.CONFLICT
        )

    user = User(
        username=signup_form.username.data,
        email=signup_form.email.data,
        password=signup_form.password.data,
        user_picture=utils.random_user_picture(),
    )
    token = utils.generate_timed_token(user.email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/welcome.html",
        username=user.username,
        confirm_url=confirm_url.replace("/api", ""),
    )
    subject = "Welcome!"
    send_email.delay(user.email, subject, html)
    db.session.add(user)
    db.session.commit()
    return {"message": "Confirmation email sent."}, HTTPStatus.CREATED


@auth.route("/confirm/<token>/", methods=["GET"])
def confirm_email(token):
    try:
        email = utils.confirm_timed_token(token)
    except Exception:
        raise HTTPError(
            "The confirmation link is invalid or has expired.",
            status_code=HTTPStatus.GONE,
        )

    user = User.find(email=email)
    if not user and not current_user.is_authenticated:
        raise HTTPError(
            "Need to sign in to confirm email change",
            status_code=HTTPStatus.UNAUTHORIZED,
        )
    if user and user.confirmed:
        raise HTTPError("This email is already confirmed.", HTTPStatus.FORBIDDEN)
    if current_user.is_authenticated and current_user.confirmed:
        current_user.change_email(email)
    else:
        user.confirmed = True
        db.session.commit()
    return {"message": "The email is now confirmed."}, HTTPStatus.OK


@auth.route("/confirm/resend/", methods=["POST"])
@limiter.limit("10/hour")
def resend_confirmation():
    email_form = EmailForm()
    if not email_form.validate():
        raise HTTPError(
            "Cannot resend the confirmation email.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    email = email_form.email.data
    existing_user = User.exists(email=email)
    if not existing_user:
        raise HTTPError(
            "No user with this email exists.", status_code=HTTPStatus.BAD_REQUEST
        )

    token = utils.generate_timed_token(email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/email_confirmation.html", confirm_url=confirm_url.replace("/api", "")
    )
    subject = "Please confirm your email"
    send_email.delay(email, subject, html)
    return {"message": "Confirmation email sent."}, HTTPStatus.OK
