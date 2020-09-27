from flask.json import jsonify
from flask_login import current_user, login_required
from requests import get
from werkzeug.exceptions import BadRequest

from server.api.providers.base import providers_bp
from server.extensions.marshmallow import body, jsonify_with
from server.helpers.providers.radarr import radarr_url, test_radarr_status
from server.models import RadarrConfig
from server.schemas import RadarrConfigSchema


@providers_bp.route("/radarr/config/", methods=["PATCH"])
@login_required
@body(RadarrConfigSchema)
def test_radarr_config(config):
    test = test_radarr_status(config)
    if not test:
        raise BadRequest("Failed to connect to Radarr.")

    version = int(test["version"][0])
    config.version = version
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


@providers_bp.route("/radarr/config/")
@login_required
@jsonify_with(RadarrConfigSchema)
def get_radarr_config():
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        return {}
    return radarr_config


@providers_bp.route("/radarr/config/", methods=["PUT"])
@login_required
@body(RadarrConfigSchema)
@jsonify_with(RadarrConfigSchema)
def update_radarr_config(config):
    radarr_config = RadarrConfig.find(user=current_user)
    if not radarr_config:
        radarr_config = RadarrConfig()
        radarr_config.api_key = config.api_key
        radarr_config.host = config.host
        radarr_config.root_folder = config.root_folder
        radarr_config.quality_profile_id = config.root_folder
        radarr_config.user = current_user

    if not test_radarr_status(config):
        raise BadRequest("Failed to connect to Radarr.")

    radarr_config.update(config)
    return radarr_config
