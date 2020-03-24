from http import HTTPStatus

from flask_login import current_user, fresh_login_required

from server import db, utils
from server.auth import auth


@auth.route("/key")
@fresh_login_required
def get_api_key():
    return {"api_key": current_user.api_key}


@auth.route("/key", methods=["DELETE"])
@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    db.session.commit()
    return {"message": "API key deleted"}, HTTPStatus.OK


@auth.route("/key/reset")
@fresh_login_required
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    db.session.commit()
    return {"api_key": current_user.api_key}
