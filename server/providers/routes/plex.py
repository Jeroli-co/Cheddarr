import xml.etree.ElementTree as ET
from http import HTTPStatus

import requests
from flask import jsonify
from flask_login import current_user, login_required
from plexapi.myplex import MyPlexAccount

from server.exceptions import HTTPError
from server.providers.forms import PlexConfigForm
from server.providers.models import PlexConfig
from server.providers.routes import provider
from server.providers.serializers.provider_serializer import plex_serializer


@provider.route("/plex/config/", methods=["GET"])
@login_required
def get_plex_config():
    plex_user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    return plex_serializer.jsonify(plex_user_config)


@provider.route("/plex/config/", methods=["PUT"])
@login_required
def update_plex_config():
    config_form = PlexConfigForm()
    if not config_form.validate():
        raise HTTPError(
            "Error while updating provider's config",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=config_form.errors,
        )
    updated_config = config_form.data
    user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    if not user_config:
        raise HTTPError(
            "No config created for this provider", status_code=HTTPStatus.BAD_REQUEST
        )
    user_config.update_config(updated_config)
    return plex_serializer.jsonify(user_config)


@provider.route("/plex/servers/", methods=["GET"])
@login_required
def get_plex_servers():
    api_key = PlexConfig.get_api_key(current_user)
    plex_account = MyPlexAccount(api_key)
    r = requests.get(
        plex_account.PLEXSERVERS.format(machineId=""), headers={"X-PLEX-TOKEN": api_key}
    )
    root = ET.fromstring(r.content)
    servers = [
        {"name": child.attrib["name"], "machine_id": child.attrib["machineIdentifier"]}
        for child in root
    ]
    return jsonify(servers)
