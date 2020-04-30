from flask import render_template, url_for
from flask_login import current_user

from server import utils
from server.auth.forms import EmailForm, SignupForm
from server.auth.models import User
from server.auth.routes import auth
from server.exceptions import (
    BadRequest,
    Conflict,
    Forbidden,
    Gone,
    InternalServerError,
    Unauthorized,
)
from server.extensions import db, limiter
from server.tasks import send_email


@auth.route("/sign-up/", methods=["POST"])
@limiter.limit("10/hour")
def signup():
    signup_form = SignupForm()
    if not signup_form.validate():
        raise InternalServerError(
            "Error while signing up.", payload=signup_form.errors,
        )

    existing_email = User.exists(email=signup_form.email.data)
    if existing_email:
        raise Conflict("This email is already taken.")

    existing_username = User.exists(username=signup_form.username.data)
    if existing_username:
        raise Conflict("This username is not available.")

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
    return {"message": "Confirmation email sent."}


@auth.route("/confirm/<token>/", methods=["GET"])
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
        db.session.commit()
    return {"message": "The email is now confirmed."}


@auth.route("/confirm/resend/", methods=["POST"])
@limiter.limit("10/hour")
def resend_confirmation():
    email_form = EmailForm()
    if not email_form.validate():
        raise InternalServerError(
            "Cannot resend the confirmation email.", payload=email_form.errors
        )

    email = email_form.email.data
    existing_user = User.exists(email=email)
    if not existing_user:
        raise BadRequest("No user with this email exists.")

    token = utils.generate_timed_token(email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/email_confirmation.html", confirm_url=confirm_url.replace("/api", "")
    )
    subject = "Please confirm your email"
    send_email.delay(email, subject, html)
    return {"message": "Confirmation email sent."}
