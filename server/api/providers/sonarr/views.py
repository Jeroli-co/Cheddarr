from flask_login import current_user, login_required
from requests import get
from server.extensions.marshmallow import body
from werkzeug.exceptions import BadRequest

from .models import SonarrConfig
from .schemas import SonarrConfigSchema

sonarr_config_serializer = SonarrConfigSchema()


@login_required
def get_sonarr_status():
    sonarr_config = SonarrConfig.find(user=current_user)
    if not sonarr_config:
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
    sonarr_config = SonarrConfig.find(user=current_user)
    if not sonarr_config:
        return {}
    return sonarr_config_serializer.jsonify(sonarr_config)


@login_required
@body(SonarrConfigSchema)
def update_sonarr_config(config):
    sonarr_config = SonarrConfig.find(user=current_user)
    if not sonarr_config:
        sonarr_config = SonarrConfig(api_key=config["api_key"])
        sonarr_config.user = current_user

    sonarr_config.update(config)
    return sonarr_config_serializer.jsonify(sonarr_config)
