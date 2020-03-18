from http import HTTPStatus

from flask_login import login_required

from server import InvalidUsage
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

    return {"message": "Username changed"}, HTTPStatus.OK
