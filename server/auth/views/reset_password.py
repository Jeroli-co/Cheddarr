from http import HTTPStatus

from flask import render_template, request, url_for

from server import utils
from server.auth import auth
from server.auth.forms import EmailForm, PasswordForm
from server.auth.models import User
from server.exceptions import HTTPError
from server.extensions import limiter
from server.tasks import send_email


@auth.route("/reset/password/", methods=["POST"])
@limiter.limit("3/hour")
def reset_password():
    email_form = EmailForm()
    if not email_form.validate():
        raise HTTPError(
            "Error while sending the reset instructions.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=email_form.errors,
        )
    email = email_form.email.data
    user = User.find(email=email)
    if not user:
        raise HTTPError(
            "No user registered with this email.", status_code=HTTPStatus.BAD_REQUEST,
        )
    token = utils.generate_timed_token([user.email, user.session_token])
    reset_url = url_for("auth.confirm_reset", token=token, _external=True)
    html = render_template(
        "email/reset_password_instructions.html",
        reset_url=reset_url.replace("/api", ""),
    )
    subject = "Reset your password"
    send_email.delay(email, subject, html)
    return {"message": "Reset instructions sent."}, HTTPStatus.OK


@auth.route("/reset/<token>/", methods=["GET", "POST"])
def confirm_reset(token):
    try:
        data = utils.confirm_timed_token(token)
    except Exception:
        raise HTTPError(
            "The reset link is invalid or has expired.", status_code=HTTPStatus.GONE
        )

    user = User.find(email=data[0])
    session_token = data[1]
    if session_token != user.session_token:
        raise HTTPError("Reset password unavailable.", status_code=HTTPStatus.FORBIDDEN)

    if request.method == "POST":
        password_form = PasswordForm()
        if not password_form.validate():
            raise HTTPError(
                "Error while resetting the password.",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                payload=password_form.errors,
            )
        user.change_password(password_form.password.data)
        html = render_template("email/reset_password_notice.html",)
        subject = "Your password has been reset"
        send_email.delay(user.email, subject, html)
        return {"message": "Password reset."}, HTTPStatus.OK

    return {"message": "Able to reset."}, HTTPStatus.OK
