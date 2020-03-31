from http import HTTPStatus

from flask_login import current_user, fresh_login_required

from server import db, utils
from server.auth import auth
from server.auth.models import ApiKey
from server.auth.serializers.auth_serializer import api_key_serializer


@auth.route("/key/cheddarr/", methods=["GET"])
@fresh_login_required
def get_api_key():
    api_key = ApiKey.find(user=current_user, provider="cheddarr")
    return api_key_serializer.dump(api_key), HTTPStatus.OK


@auth.route("/key/cheddarr/", methods=["DELETE"])
@fresh_login_required
def delete_api_key():
    api_key = ApiKey.find(user=current_user, provider="cheddarr")
    db.session.delete(api_key)
    db.session.commit()
    return {"message": "API key deleted"}, HTTPStatus.OK


@auth.route("/key/cheddarr/reset/", methods=["GET"])
@fresh_login_required
def reset_api_key():
    api_key = ApiKey.find(user=current_user, provider="cheddarr")
    if not api_key:
        api_key = ApiKey(provider="cheddarr", user_id=current_user.id)
    api_key.key = utils.generate_api_key()
    db.session.add(api_key)
    db.session.commit()
    return api_key_serializer.dump(api_key), HTTPStatus.OK


@auth.route("/key/plex/", methods=["GET"])
@fresh_login_required
def check_plex_api_key():
    plex_api_key = ApiKey.find(user=current_user, provider="plex")
    if not plex_api_key:
        return {}, HTTPStatus.NOT_FOUND
    return {}, HTTPStatus.OK


def set_plex_api_key(auth_token, user_id):
    plex_api_key = ApiKey(user_id=user_id, provider="plex", key=auth_token)
    db.session.add(plex_api_key)
    db.session.commit()
