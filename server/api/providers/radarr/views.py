from flask.json import jsonify
from flask_login import current_user, login_required
from marshmallow import fields
from requests import get
from server.extensions.marshmallow import body, query
from werkzeug.exceptions import BadRequest

from .helpers import radarr_url
from .models import RadarrConfig
from .schemas import RadarrConfigSchema

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
    url = radarr_url(config, "/system/status")
    try:
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
        radarr_config = RadarrConfig()
        radarr_config.api_key = config["api_key"]
        radarr_config.host = config["host"]
        radarr_config.user = current_user

    radarr_config.update(config)
    return radarr_config_serializer.jsonify(radarr_config)


@login_required
def get_radarr_root_folders():
    config = RadarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Radarr config.")
    url = radarr_url(radarr_config_serializer.dump(config), "/rootFolder")
    root_folders = [folder["path"] for folder in get(url).json()]
    return jsonify(root_folders)


@login_required
def get_radarr_quality_profiles():
    config = RadarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Radarr config.")
    url = radarr_url(radarr_config_serializer.dump(config), "/profile")
    profiles = [
        {"id": profile["id"], "name": profile["name"]} for profile in get(url).json()
    ]
    return jsonify(profiles)


@login_required
@query({"tmdb_id": fields.Integer()})
def radarr_lookup(tmdb_id):
    config = RadarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Radarr config.")
    url = radarr_url(
        radarr_config_serializer.dump(config),
        "/movie/lookup/tmdb",
        queries={"tmdbId": tmdb_id},
    )
    lookup = get(url).json()
    return jsonify(lookup)
