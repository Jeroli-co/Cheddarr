from http import HTTPStatus

from flask_login import fresh_login_required, current_user

from server import InvalidUsage, db
from server.auth import auth
from server.auth.forms import ChangePasswordForm


@auth.route("/change/password", methods=["POST"])
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while changing password",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=password_form.errors,
        )

    if (
        current_user.password is not None
        or current_user.password != password_form.oldPassword.data
    ):
        raise InvalidUsage(
            "Error while changing password", status_code=HTTPStatus.UNAUTHORIZED,
        )

    current_user.password = password_form.newPassword.data
    db.session.commit()
    return {"message": "Password changed"}, HTTPStatus.OK
