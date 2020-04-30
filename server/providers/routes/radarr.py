from flask_login import current_user, login_required
from requests.exceptions import InvalidURL
from sqlalchemy.orm.exc import NoResultFound
from requests import get
from server.exceptions import InternalServerError, BadRequest
from server.providers.forms import RadarrConfigForm
from server.providers.models.provider_config import RadarrConfig
from server.providers.routes import provider
from server.providers.serializers.provider_config_serializer import (
    radarr_config_serializer,
)


@provider.route("/radarr/status/", methods=["GET"])
@login_required
def get_radarr_status():
    try:
        radarr_config = RadarrConfig.find(current_user)
    except NoResultFound:
        raise InternalServerError("No existing config for Radarr.")
    host = radarr_config.host
    port = radarr_config.port
    api_key = radarr_config.provider_api_key
    ssl = "https" if radarr_config.ssl else "http"
    try:
        r = get(f"{ssl}://{host}:{port}/api/system/status?apikey={api_key}")
    except InvalidURL:
        raise BadRequest("Invalid config for Radarr.")
    return {"status": radarr_config.enabled and r.status_code == 200}


@provider.route("/radarr/config/test/", methods=["POST"])
@login_required
def test_radarr_config():
    config_form = RadarrConfigForm()
    if not config_form.validate():
        raise InternalServerError(
            "Error while updating Radarr config.", payload=config_form.errors,
        )
    host = config_form.host.data
    port = config_form.port.data
    api_key = config_form.provider_api_key.data
    ssl = "https" if config_form.ssl.data else "http"
    try:
        print(f"{ssl}://{host}:{port}/api/system/status?apikey={api_key}")
        r = get(f"{ssl}://{host}:{port}/api/system/status?apikey={api_key}")

    except InvalidURL:
        raise BadRequest("Invalid config for Radarr.")
    return {"status": r.status_code == 200}


@provider.route("/radarr/config/", methods=["GET"])
@login_required
def get_radarr_config():
    try:
        radarr_config = RadarrConfig.find(current_user)
    except NoResultFound:
        raise InternalServerError("No existing config for Radarr.")
    return radarr_config_serializer.jsonify(radarr_config)


@provider.route("/radarr/config/", methods=["PATCH"])
@login_required
def update_radarr_config():
    config_form = RadarrConfigForm()
    if not config_form.validate():
        raise InternalServerError(
            "Error while updating Radarr config.", payload=config_form.errors,
        )
    try:
        user_config = RadarrConfig.find(current_user)
    except NoResultFound:
        user_config = RadarrConfig()
        user_config.user = current_user

    updated_config = config_form.data
    user_config.update(updated_config)
    return radarr_config_serializer.jsonify(user_config)
