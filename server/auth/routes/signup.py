from http import HTTPStatus
from flask import url_for, render_template
from server import db, InvalidUsage
from server.auth import auth, User, utils
from server.auth.forms import SignupForm, EmailForm


@auth.route("/sign-up", methods=["POST"])
def signup():
    signup_form = SignupForm()
    if not signup_form.validate():
        raise InvalidUsage(
            "Error in signup form.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=signup_form.errors,
        )

    existing_user = User.exists(email=signup_form.email.data)
    if existing_user:
        raise InvalidUsage("The user already exists.", status_code=HTTPStatus.CONFLICT)

    # TODO: verify if username already exist

    user = User.create(
        first_name=signup_form.firstName.data,
        last_name=signup_form.lastName.data,
        email=signup_form.email.data,
        username=signup_form.username.data,
        password=signup_form.password.data,
    )

    token = utils.generate_timed_token(user.email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/welcome.html",
        username=user.username,
        confirm_url=confirm_url.replace("/api", ""),
    )
    subject = "Welcome!"
    db.session.add(user)
    db.session.commit()
    utils.send_email(user.email, subject, html)
    return {"message": "Confirmation email sent"}, HTTPStatus.OK


@auth.route("/confirm/<token>")
def confirm_email(token):
    try:
        email = utils.confirm_token(token)
    except:
        raise InvalidUsage(
            "The confirmation link is invalid or has expired.",
            status_code=HTTPStatus.GONE,
        )

    user = User.find(email=email)
    if user and user.confirmed:
        raise InvalidUsage("The account is already confirmed.", HTTPStatus.CONFLICT)

    user.confirmed = True
    db.session.commit()
    return {"message": "Account confirmed"}, HTTPStatus.CREATED


@auth.route("/confirm/resend", methods=["POST"])
def resend_confirmation():
    email_form = EmailForm()
    if not email_form.validate():
        raise InvalidUsage(
            "Cannot resend confirmation email",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    email = email_form.email.data
    existing_user = User.exists(email=email)
    if not existing_user:
        raise InvalidUsage(
            "No user with this email exists", status_code=HTTPStatus.BAD_REQUEST
        )

    token = utils.generate_timed_token(email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/account_confirmation.html", confirm_url=confirm_url.replace("/api", "")
    )
    subject = "Please confirm your email"
    utils.send_email(email, subject, html)
    return {"message": "Confirmation email sent"}, HTTPStatus.OK
