from flask.json import jsonify
from flask_login import current_user, login_required
from marshmallow import fields
from requests import get
from server.extensions.marshmallow import body, query
from werkzeug.exceptions import BadRequest

from .helpers import radarr_url, test_radarr_status
from .models import RadarrConfig
from .schemas import RadarrConfigSchema

radarr_config_serializer = RadarrConfigSchema()


@login_required
@body(RadarrConfigSchema)
def test_radarr_config(config):
    test = test_radarr_status(config)
    if not test:
        raise BadRequest("Failed to connect to Radarr.")

    version = test.get("version")
    root_folders = [
        folder["path"] for folder in get(radarr_url(config, "/rootFolder")).json()
    ]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]}
        for profile in get(radarr_url(config, "/profile")).json()
    ]
    return jsonify(
        {
            "version": version,
            "root_folders": root_folders,
            "quality_profiles": quality_profiles,
        }
    )


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
        radarr_config.root_folder = config["root_folder"]
        radarr_config.quality_profile_id = config["root_folder"]
        radarr_config.user = current_user

    if not test_radarr_status(config):
        raise BadRequest("Failed to connect to Radarr.")

    radarr_config.update(config)
    return radarr_config_serializer.jsonify(radarr_config)


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
