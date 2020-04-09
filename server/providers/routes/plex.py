import xml.etree.ElementTree as ET
from http import HTTPStatus

import requests
from flask import jsonify
from flask_login import current_user, login_required
from plexapi.library import MovieSection
from plexapi.myplex import MyPlexAccount

from server.exceptions import HTTPError
from server.extensions import cache
from server.providers.forms import PlexConfigForm
from server.providers.models import PlexConfig
from server.providers.routes import provider
from server.providers.serializers.media_serializer import plex_movie_serializer
from server.providers.serializers.provider_config_serializer import (
    plex_config_serializer,
)


@provider.route("/plex/config/", methods=["GET"])
@login_required
def get_plex_config():
    plex_user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    return plex_config_serializer.jsonify(plex_user_config)


@provider.route("/plex/config/", methods=["PATCH"])
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
    return plex_config_serializer.jsonify(user_config)


@provider.route("/plex/servers/", methods=["GET"])
@login_required
def get_plex_user_servers():
    plex_config = PlexConfig.find(current_user)
    api_key = plex_config.provider_api_key
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


@provider.route("/plex/movies/recent/", methods=["GET"])
@login_required
# @cache.cached(timeout=300)
def get_plex_recent_movies():
    plex_server = get_plex_user_server(current_user)
    movie_sections = [
        section
        for section in plex_server.library.sections()
        if isinstance(section, MovieSection)
    ]
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    print(plex_movie_serializer.load(plex_movie_serializer.dump(recent_movies[0])))
    return jsonify(recent_movies)


# @cache.memoize(timeout=900)
def get_plex_user_server(user):
    plex_config = PlexConfig.find(user)
    api_key = plex_config.provider_api_key
    server_name = plex_config.machine_name
    return MyPlexAccount(api_key).resource(server_name).connect()
