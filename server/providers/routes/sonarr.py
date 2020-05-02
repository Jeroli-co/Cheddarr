import re

from flask_login import current_user, login_required
from sqlalchemy.orm.exc import NoResultFound
from requests import get
from server.exceptions import InternalServerError, BadRequest
from server.providers.forms import SonarrConfigForm
from server.providers.models.provider_config import SonarrConfig
from server.providers.routes import provider
from server.providers.serializers.provider_config_serializer import (
    radarr_config_serializer,
    sonarr_config_serializer,
)


@provider.route("/sonarr/status/", methods=["GET"])
@login_required
def get_sonarr_status():
    try:
        sonarr_config = SonarrConfig.find(current_user)
    except NoResultFound:
        return {"status": False}
    return {"status": sonarr_config.enabled}


@provider.route("/sonarr/config/test/", methods=["POST"])
@login_required
def test_sonarr_config():
    config_form = SonarrConfigForm()
    if not config_form.validate():
        raise InternalServerError(
            "Error while updating Sonarr config.", payload=config_form.errors,
        )
    host = config_form.host.data
    port = config_form.port.data
    api_key = config_form.provider_api_key.data
    ssl = "https" if config_form.ssl.data else "http"
    try:
        url = f"{ssl}://{host}:{port}/api/system/status?apikey={api_key}"
        r = get(url)
    except Exception:
        raise BadRequest("Failed to connect to Sonarr.")
    return {"status": r.status_code == 200}


@provider.route("/sonarr/config/", methods=["GET"])
@login_required
def get_sonarr_config():
    try:
        sonarr_config = SonarrConfig.find(current_user)
    except NoResultFound:
        return {}
    return radarr_config_serializer.jsonify(sonarr_config)


@provider.route("/sonarr/config/", methods=["PATCH"])
@login_required
def update_sonarr_config():
    config_form = SonarrConfigForm()
    if not config_form.validate():
        raise InternalServerError(
            "Error while updating Sonarr config.", payload=config_form.errors,
        )
    try:
        user_config = SonarrConfig.find(current_user)
    except NoResultFound:
        user_config = SonarrConfig()
        user_config.user = current_user

    updated_config = config_form.data
    user_config.update(updated_config)
    return sonarr_config_serializer.jsonify(user_config)
