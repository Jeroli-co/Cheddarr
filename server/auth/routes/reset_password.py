from http import HTTPStatus

from flask import url_for, render_template, request
from flask_login import current_user

from server import InvalidUsage, db
from server.auth import auth, User
from server.auth.forms import EmailForm, ResetPasswordForm
from server.auth.utils import generate_confirmation_token, send_email, confirm_token


@auth.route("/reset/password", methods=["POST"])
def reset_password():
    email_form = EmailForm()
    if email_form.validate():
        email = email_form.email.data
        existing_user = User.exists(email=email)
        if existing_user:
            token = generate_confirmation_token(email)
            reset_url = url_for("auth.confirm_reset", token=token, _external=True)
            html = render_template("email/reset_password_instructions.html", reset_url=reset_url.replace("/api", ""))
            subject = "Reset your password"
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

    if request.method == "GET":
        user.confirmed = False
        db.session.commit()
        return {"message": "Able to reset."}, HTTPStatus.OK

    if request.method == "POST":
        password_form = ResetPasswordForm()
        if password_form.validate():
            current_user.password = password_form.password.data
            db.session.commit()
            return {"message": "Password reset"}, HTTPStatus.OK
        raise InvalidUsage("Error in change password form.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                           payload=password_form.errors)
