from flask_login import current_user, login_required
from requests import get
from server.api.providers.radarr.models import RadarrConfig
from server.api.providers.radarr.schemas import RadarrConfigSchema
from server.extensions.marshmallow import body
from werkzeug.exceptions import BadRequest

radarr_config_serializer = RadarrConfigSchema()


@login_required
def get_radarr_status():
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        return {"status": False}
    return {"status": radarr_config.enabled}


@login_required
@body(RadarrConfigSchema)
def test_radarr_config(config):
    host = config["host"]
    port = config["port"]
    api_key = config["api_key"]
    ssl = "https" if config["ssl"] else "http"
    try:
        url = f"{ssl}://{host}:{port}/api/system/status?apikey={api_key}"
        r = get(url)
    except Exception:
        raise BadRequest("Failed to connect to Radarr.")
    return {"status": r.status_code == 200}


@login_required
def get_radarr_config():
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        return {}
    return radarr_config_serializer.jsonify(radarr_config)


@login_required
@body(RadarrConfigSchema)
def update_radarr_config(config):
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        radarr_config = RadarrConfig(api_key=config["api_key"])
        radarr_config.user = current_user

    radarr_config.update(config)
    return radarr_config_serializer.jsonify(radarr_config)
