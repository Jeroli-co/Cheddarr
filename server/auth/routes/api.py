from http import HTTPStatus

from flask_login import current_user, fresh_login_required

from server import db, utils
from server.auth import auth
from server.providers.models import PlexConfig


@auth.route("/key/cheddarr/", methods=["GET"])
@fresh_login_required
def get_api_key():
    return {"key": current_user.api_key}


@auth.route("/key/cheddarr/", methods=["DELETE"])
@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    return {"message": "API key deleted"}, HTTPStatus.OK


@auth.route("/key/cheddarr/reset/", methods=["GET"])
@fresh_login_required
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    db.session.commit()
    return {"key": current_user.api_key}


@auth.route("/key/plex/", methods=["GET"])
@fresh_login_required
def check_plex_api_key():
    plex_api_key = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    if not plex_api_key:
        return {"message": "No API key set."}, HTTPStatus.NOT_FOUND
    return {"key": plex_api_key}, HTTPStatus.OK
