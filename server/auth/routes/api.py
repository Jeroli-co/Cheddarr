from http import HTTPStatus

from flask_login import current_user, fresh_login_required

from server import db, utils, limiter
from server.providers.models import PlexConfig
from server.auth.routes import auth


@auth.route("/key/cheddarr/", methods=["GET"])
@fresh_login_required
def get_api_key():
    return {"key": current_user.api_key}


@auth.route("/key/cheddarr/", methods=["DELETE"])
@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    return {"message": "API key deleted"}, HTTPStatus.OK


@auth.route("/key/reset/", methods=["GET"])
@limiter.limit("3/hour")
@auth.route("/key/cheddarr/reset/", methods=["GET"])
@fresh_login_required
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    db.session.commit()
    return {"key": current_user.api_key}
