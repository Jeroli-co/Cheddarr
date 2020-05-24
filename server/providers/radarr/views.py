from flask_login import current_user, login_required
from requests import get
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import BadRequest

from server.extensions.marshmallow import body
from server.providers.radarr.models import RadarrConfig
from server.providers.radarr.schemas import RadarrConfigSchema

radarr_config_serializer = RadarrConfigSchema()


@login_required
def get_radarr_status():
    try:
        radarr_config = RadarrConfig.find(current_user)
    except NoResultFound:
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
    try:
        radarr_config = RadarrConfig.find(current_user)
    except NoResultFound:
        return {}
    return radarr_config_serializer.jsonify(radarr_config)


@login_required
@body(RadarrConfigSchema)
def update_radarr_config(config):
    try:
        user_config = RadarrConfig.find(current_user)
    except NoResultFound:
        user_config = RadarrConfig(api_key=config["api_key"])
        user_config.user = current_user

    user_config.update(config)
    return radarr_config_serializer.jsonify(user_config)
