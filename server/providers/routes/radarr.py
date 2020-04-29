from http import HTTPStatus

from flask_login import current_user, login_required
from sqlalchemy.orm.exc import NoResultFound

from server.exceptions import HTTPError
from server.providers.forms import RadarrConfigForm
from server.providers.models.provider_config import RadarrConfig
from server.providers.routes import provider
from server.providers.serializers.provider_config_serializer import (
    provider_status_serializer,
    radarr_config_serializer,
)


@provider.route("/radarr/config/", methods=["GET"])
@login_required
def get_radarr_config():
    try:
        radarr_config = RadarrConfig.find(current_user)
    except NoResultFound:
        raise HTTPError(
            "No config for this provider.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
    return radarr_config_serializer.jsonify(radarr_config), HTTPStatus.OK


@provider.route("/radarr/config/status/", methods=["GET"])
@login_required
def get_radarr_config_status():
    try:
        radarr_config = RadarrConfig.find(current_user)
    except NoResultFound:
        raise HTTPError(
            "No config for this provider.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )
    return provider_status_serializer.dump(radarr_config), HTTPStatus.OK


@provider.route("/radarr/config/", methods=["PATCH"])
@login_required
def update_radarr_config():
    config_form = RadarrConfigForm()
    if not config_form.validate():
        raise HTTPError(
            "Error while updating Radarr config.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=config_form.errors,
        )
    try:
        user_config = RadarrConfig.find(current_user)
    except NoResultFound:
        user_config = RadarrConfig()
        user_config.user = current_user
    updated_config = config_form.data
    user_config.update(updated_config)
    print(user_config)
    return radarr_config_serializer.jsonify(user_config), HTTPStatus.OK
