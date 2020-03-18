from http import HTTPStatus

from flask import render_template
from flask_login import fresh_login_required, current_user

from server import InvalidUsage, db
from server.auth import utils
from server.settings import settings
from server.settings.forms import ChangePasswordForm


@settings.route("/change/password", methods=["POST"])
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while changing password",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=password_form.errors,
        )

    if current_user.password is not None and not current_user.check_password(
        password_form.oldPassword.data
    ):
        raise InvalidUsage(
            "Error while changing password", status_code=HTTPStatus.UNAUTHORIZED,
        )

    current_user.password = password_form.newPassword.data
    db.session.commit()
    html = render_template("email/change_password_notice.html")
    subject = "Your password has been chnaged"
    utils.send_email(current_user.email, subject, html)
    return {"message": "Password changed"}, HTTPStatus.OK
