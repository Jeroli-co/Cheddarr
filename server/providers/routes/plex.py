from http import HTTPStatus

from flask import jsonify
from flask_login import current_user, login_required
from plexapi.myplex import MyPlexAccount
from plexapi.video import Movie

from server.exceptions import HTTPError
from server.extensions import cache
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
    provider_status_serializer,
)
from server.providers.utils.plex import user_server, library_sections


@provider.route("/plex/config/", methods=["GET"])
@login_required
def get_user_config():
    plex_user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    return plex_config_serializer.jsonify(plex_user_config), HTTPStatus.OK


@provider.route("/plex/config/status/", methods=["GET"])
@login_required
def get_user_config_status():
    plex_user_config = PlexConfig.query.filter_by(user_id=current_user.id).one_or_none()
    return provider_status_serializer.dump(plex_user_config), HTTPStatus.OK


@provider.route("/plex/config/", methods=["PATCH"])
@login_required
def update_config():
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
    return plex_config_serializer.jsonify(user_config), HTTPStatus.OK


@provider.route("/plex/servers/", methods=["GET"])
@login_required
def get_user_servers():
    plex_config = PlexConfig.find(current_user)
    api_key = plex_config.provider_api_key
    plex_account = MyPlexAccount(api_key)
    servers = [
        {"name": resource.name, "machine_id": resource.clientIdentifier}
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]
    return jsonify(servers), HTTPStatus.OK


@provider.route("/plex/movies/recent/", methods=["GET"])
@login_required
@cache.cached(timeout=180)
def get_recent_movies():
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    movie_sections = library_sections(plex_server, section_type="movies")
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    return plex_movies_serializer.jsonify(recent_movies, many=True), HTTPStatus.OK


@provider.route("/plex/movies/<movie_id>/", methods=["GET"])
@login_required
@cache.memoize(timeout=600)
def get_movie(movie_id):
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    movie = plex_server.fetchItem(ekey=int(movie_id))
    movie.reload()
    return plex_movies_serializer.jsonify(movie), HTTPStatus.OK


@provider.route("/plex/series/recent/", methods=["GET"])
@login_required
@cache.memoize(timeout=180)
def get_recent_series():
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    series_section = library_sections(plex_server, section_type="series")
    recent_series = [
        series
        for section in series_section
        for series in section.recentlyAdded(maxresults=20)
    ]
    return plex_episodes_serializer.jsonify(recent_series, many=True), HTTPStatus.OK


@provider.route("/plex/series/<series_id>/", methods=["GET"])
@login_required
@cache.memoize(timeout=180)
def get_series(series_id):
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    series = plex_server.fetchItem(ekey=int(series_id))
    series.reload()
    return plex_series_serializer.jsonify(series), HTTPStatus.OK


@provider.route(
    "/plex/series/<series_id>/seasons/<season_number>/", methods=["GET"],
)
@login_required
@cache.memoize(timeout=180)
def get_season(series_id, season_number):
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    series = plex_server.fetchItem(ekey=int(series_id))
    season = series.episode(season=int(season_number))
    season.reload()
    return plex_seasons_serializer.jsonify(season), HTTPStatus.OK


@provider.route(
    "/plex/series/<series_id>/seasons/<season_number>/episodes/<episode_number>/",
    methods=["GET"],
)
@login_required
@cache.memoize(timeout=600)
def get_episode(series_id, season_number, episode_number):
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    series = plex_server.fetchItem(ekey=int(series_id))
    episode = series.episode(season=int(season_number), episode=int(episode_number))
    episode.reload()
    return plex_episodes_serializer.jsonify(episode), HTTPStatus.OK


@provider.route("/plex/onDeck/", methods=["GET"])
@login_required
@cache.memoize(timeout=180)
def get_on_deck():
    plex_server = user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    on_deck = plex_server.library.onDeck()
    on_deck = [
        plex_movies_serializer.dump(media)
        if isinstance(media, Movie)
        else plex_episodes_serializer.dump(media)
        for media in on_deck
    ]
    return jsonify(on_deck), HTTPStatus.OK
