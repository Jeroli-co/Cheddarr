from flask import jsonify
from flask_login import current_user, login_required
from plexapi.myplex import MyPlexAccount
from plexapi.video import Movie
from sqlalchemy.orm.exc import NoResultFound

from server.exceptions import InternalServerError, BadRequest
from server.providers.forms import PlexConfigForm
from server.providers.models import PlexConfig
from server.providers.routes import provider
from server.providers.serializers.media_serializer import (
    plex_movies_serializer,
    plex_series_serializer,
    plex_seasons_serializer,
    plex_episodes_serializer,
)
from server.providers.serializers.provider_config_serializer import (
    plex_config_serializer,
)
from server.providers.utils.plex import user_server, library_sections


@provider.route("/plex/status/", methods=["GET"])
@login_required
def get_plex_status():
    try:
        plex_config = PlexConfig.find(current_user)
    except NoResultFound:
        return {"status": False}
    up = (
        MyPlexAccount(plex_config.provider_api_key)
        .resource(plex_config.machine_name)
        .presence
    )
    return {"status": plex_config.enabled and up}


@provider.route("/plex/config/", methods=["GET"])
@login_required
def get_plex_config():
    try:
        plex_user_config = PlexConfig.find(current_user)
    except NoResultFound:
        return {}
    return plex_config_serializer.jsonify(plex_user_config)


@provider.route("/plex/config/", methods=["PATCH"])
@login_required
def update_plex_config():
    config_form = PlexConfigForm()
    if not config_form.validate():
        raise InternalServerError(
            "Error while updating provider's config", payload=config_form.errors,
        )
    updated_config = config_form.data
    try:
        user_config = PlexConfig.find(current_user)
    except NoResultFound:
        raise InternalServerError("No existing config for Plex.")
    if not user_config:
        raise BadRequest("No config created for this provider")

    user_config.update(updated_config)
    return plex_config_serializer.jsonify(user_config)


@provider.route("/plex/servers/", methods=["GET"])
@login_required
def get_plex_servers():
    try:
        plex_config = PlexConfig.find(current_user)
    except NoResultFound:
        raise InternalServerError("No existing config for Plex.")
    api_key = plex_config.provider_api_key
    plex_account = MyPlexAccount(api_key)
    servers = [
        {"name": resource.name, "machine_id": resource.clientIdentifier}
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]
    return jsonify(servers)


@provider.route("/plex/movies/recent/", methods=["GET"])
@login_required
def get_recent_movies():
    plex_server = user_server(current_user)
    movie_sections = library_sections(plex_server, section_type="movies")
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    return plex_movies_serializer.jsonify(recent_movies, many=True)


@provider.route("/plex/movies/<movie_id>/", methods=["GET"])
@login_required
def get_movie(movie_id):
    plex_server = user_server(current_user)
    movie = plex_server.fetchItem(ekey=int(movie_id))
    movie.reload()
    return plex_movies_serializer.jsonify(movie)


@provider.route("/plex/series/recent/", methods=["GET"])
@login_required
def get_recent_series():
    plex_server = user_server(current_user)
    series_section = library_sections(plex_server, section_type="series")
    recent_series = [
        series
        for section in series_section
        for series in section.recentlyAdded(maxresults=20)
    ]
    return plex_episodes_serializer.jsonify(recent_series, many=True)


@provider.route("/plex/series/<series_id>/", methods=["GET"])
@login_required
def get_series(series_id):
    plex_server = user_server(current_user)
    series = plex_server.fetchItem(ekey=int(series_id))
    series.reload()
    return plex_series_serializer.jsonify(series)


@provider.route(
    "/plex/series/<series_id>/seasons/<season_number>/", methods=["GET"],
)
@login_required
def get_season(series_id, season_number):
    plex_server = user_server(current_user)
    series = plex_server.fetchItem(ekey=int(series_id))
    season = series.episode(season=int(season_number))
    season.reload()
    return plex_seasons_serializer.jsonify(season)


@provider.route(
    "/plex/series/<series_id>/seasons/<season_number>/episodes/<episode_number>/",
    methods=["GET"],
)
@login_required
def get_episode(series_id, season_number, episode_number):
    plex_server = user_server(current_user)
    series = plex_server.fetchItem(ekey=int(series_id))
    episode = series.episode(season=int(season_number), episode=int(episode_number))
    episode.reload()
    return plex_episodes_serializer.jsonify(episode)


@provider.route("/plex/onDeck/", methods=["GET"])
@login_required
def get_on_deck():
    plex_server = user_server(current_user)
    on_deck = plex_server.library.onDeck()
    on_deck = [
        plex_movies_serializer.dump(media)
        if isinstance(media, Movie)
        else plex_episodes_serializer.dump(media)
        for media in on_deck
    ]
    return jsonify(on_deck)
