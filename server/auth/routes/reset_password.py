from http import HTTPStatus

from flask import url_for, render_template, request

from server import InvalidUsage, db
from server.auth import auth, User
from server.auth.forms import EmailForm, ResetPasswordForm
from server.auth.utils import (
    generate_timed_token,
    send_email,
    confirm_token,
    generate_token,
)


@auth.route("/reset/password", methods=["POST"])
def reset_password():
    email_form = EmailForm()
    if email_form.validate():
        email = email_form.email.data
        user = User.find(email=email)
        if user and user.confirmed:
            token = generate_timed_token([user.email, user.session_token])
            reset_url = url_for("auth.confirm_reset", token=token, _external=True)
            html = render_template(
                "email/reset_password_instructions.html",
                reset_url=reset_url.replace("/api", ""),
            )
            subject = "Reset your password"
            send_email(email, subject, html)
            return {"message": "Reset instructions sent."}, HTTPStatus.OK
    raise InvalidUsage(
        "Error when sending reset instructions",
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        payload=email_form.errors,
    )


@auth.route("/reset/<token>", methods=["GET", "POST"])
def confirm_reset(token):
    try:
        data = confirm_token(token)
    except:
        raise InvalidUsage(
            "The reset link is invalid or has expired.", status_code=HTTPStatus.GONE
        )

    user = User.find(email=data[0])
    session_token = data[1]
    if session_token != user.session_token:
        raise InvalidUsage(
            "Reset password unavailable", status_code=HTTPStatus.FORBIDDEN
        )

    if request.method == "POST":
        password_form = ResetPasswordForm()
        if password_form.validate():
            user.password = password_form.password.data
            user.session_token = generate_token([user.email, user.password])
            db.session.commit()
            html = render_template("email/reset_password_notice.html",)
            subject = "Your password has been reset"
            send_email(user.email, subject, html)
            return {"message": "Password reset"}, HTTPStatus.OK
        raise InvalidUsage(
            "Error in change password form.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=password_form.errors,
        )

    return {"message": "Able to reset."}, HTTPStatus.OK
