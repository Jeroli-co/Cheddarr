from flask_login import current_user, login_required
from requests import get
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import BadRequest

from server.extensions.marshmallow import body
from server.api.providers.sonarr.models import SonarrConfig
from server.api.providers.sonarr.schemas import SonarrConfigSchema

sonarr_config_serializer = SonarrConfigSchema()


@login_required
def get_sonarr_status():
    try:
        sonarr_config = SonarrConfig.find(current_user)
    except NoResultFound:
        return {"status": False}
    return {"status": sonarr_config.enabled}


@login_required
@body(SonarrConfigSchema)
def test_sonarr_config(config):
    host = config["host"]
    port = config["port"]
    api_key = config["api_key"]
    ssl = "https" if config["ssl"] else "http"
    try:
        url = f"{ssl}://{host}:{port}/api/system/status?apikey={api_key}"
        r = get(url)
    except Exception:
        raise BadRequest("Failed to connect to Sonarr.")
    return {"status": r.status_code == 200}


@login_required
def get_sonarr_config():
    try:
        sonarr_config = SonarrConfig.find(current_user)
    except NoResultFound:
        return {}
    return sonarr_config_serializer.jsonify(sonarr_config)


@login_required
@body(SonarrConfigSchema)
def update_sonarr_config(config):
    try:
        user_config = SonarrConfig.find(current_user)
    except NoResultFound:
        user_config = SonarrConfig(api_key=config["api_key"])
        user_config.user = current_user

    user_config.update(config)
    return sonarr_config_serializer.jsonify(user_config)
