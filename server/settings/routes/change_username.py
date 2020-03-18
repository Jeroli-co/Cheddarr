from http import HTTPStatus

from flask_login import login_required, current_user

from server import InvalidUsage, db
from server.auth import User
from server.settings import settings
from server.settings.forms import ChangeUsernameForm


@settings.route("/change/username", methods=["POST"])
@login_required
def change_username():
    username_form = ChangeUsernameForm()
    if not username_form.validate():
        raise InvalidUsage(
            "Error while changing username",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    new_username = username_form.newUsername.data
    if User.exists(username=new_username):
        raise InvalidUsage(
            "This username is already taken", status_code=HTTPStatus.CONFLICT
        )

    current_user.username = username_form.newUsername.data
    db.session.commit()
    return {"message": "Username changed"}, HTTPStatus.OK
