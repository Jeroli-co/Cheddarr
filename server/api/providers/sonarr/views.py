from flask import jsonify
from flask_login import current_user, login_required
from marshmallow import fields
from requests import get
from server.extensions.marshmallow import body, query
from werkzeug.exceptions import BadRequest

from .helpers import sonarr_url
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
    url = sonarr_url(config, "/system/status")
    try:
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
        sonarr_config = SonarrConfig()
        sonarr_config.api_key = config["api_key"]
        sonarr_config.host = config["host"]
        sonarr_config.user = current_user

    sonarr_config.update(config)
    return sonarr_config_serializer.jsonify(sonarr_config)


@login_required
def get_sonarr_root_folders():
    config = SonarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Sonarr config.")
    url = sonarr_url(sonarr_config_serializer.dump(config), "/rootFolder")
    root_folders = [folder["path"] for folder in get(url).json()]
    return jsonify(root_folders)


@login_required
def get_sonarr_quality_profiles():
    config = SonarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Sonarr config.")
    if config.v3:
        url = sonarr_url(sonarr_config_serializer.dump(config), "/qualityprofile")
    else:
        url = sonarr_url(sonarr_config_serializer.dump(config), "/profile")
    profiles = [
        {"id": profile["id"], "name": profile["name"]} for profile in get(url).json()
    ]
    return jsonify(profiles)


def get_sonarr_languages_profiles():
    config = SonarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Sonarr config.")
    if not config.v3:
        raise BadRequest("Wrong Sonarr version.")
    url = sonarr_url(sonarr_config_serializer.dump(config), "/languageprofile")
    profiles = [
        {"id": profile["id"], "name": profile["name"]} for profile in get(url).json()
    ]
    return jsonify(profiles)


@login_required
@query({"tvdb_id": fields.Integer()})
def sonarr_lookup(tvdb_id):
    config = SonarrConfig.find(user=current_user)
    if not config:
        raise BadRequest("No existing Sonarr config.")
    url = sonarr_url(
        sonarr_config_serializer.dump(config),
        "/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    lookup = get(url).json()
    return jsonify(lookup)
