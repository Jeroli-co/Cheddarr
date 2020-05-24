from flask import jsonify
from flask_login import current_user, fresh_login_required, login_required
from plexapi.myplex import MyPlexAccount
from plexapi.video import Movie
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.exceptions import BadRequest, InternalServerError

from server.extensions.marshmallow import body
from server.providers.plex import utils
from server.providers.plex.models import PlexConfig
from server.providers.plex.schemas import (
    PlexConfigSchema,
    PlexEpisodeSchema,
    PlexMovieSchema,
    PlexSeasonSchema,
    PlexSeriesSchema,
)

plex_config_serializer = PlexConfigSchema()
plex_movie_serializer = PlexMovieSchema()
plex_series_serializer = PlexSeriesSchema()
plex_season_serializer = PlexSeasonSchema()
plex_episode_serializer = PlexEpisodeSchema()


@login_required
def get_plex_status():
    try:
        plex_config = PlexConfig.find(current_user)
    except NoResultFound:
        return {"status": False}
    return {"status": plex_config.enabled and plex_config.machine_id is not None}


@login_required
def get_plex_config():
    try:
        plex_user_config = PlexConfig.find(current_user)
    except NoResultFound:
        return {}
    return plex_config_serializer.jsonify(plex_user_config)


@login_required
@body(PlexConfigSchema)
def update_plex_config(args):
    try:
        user_config = PlexConfig.find(current_user)
    except NoResultFound:
        raise InternalServerError("No existing config for Plex.")
    if not user_config:
        raise BadRequest("No config created for this provider")

    user_config.update(args)
    return plex_config_serializer.jsonify(user_config)


@fresh_login_required
def unlink_plex_account():
    try:
        plex_config = PlexConfig.find(current_user)
    except NoResultFound:
        raise BadRequest("No Plex account linked.")
    plex_config.delete()
    return {"message": "Plex account unlinked."}


@login_required
def get_plex_servers():
    try:
        plex_config = PlexConfig.find(current_user)
    except NoResultFound:
        raise InternalServerError("No existing config for Plex.")
    api_key = plex_config.api_key
    plex_account = MyPlexAccount(api_key)
    servers = [
        {"name": resource.name, "machine_id": resource.clientIdentifier}
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]
    return jsonify(servers)


@login_required
def get_recent_movies():
    plex_server = utils.user_server(current_user)
    movie_sections = utils.library_sections(plex_server, section_type="movies")
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    return plex_movie_serializer.jsonify(recent_movies, many=True)


@login_required
def get_movie(movie_id):
    plex_server = utils.user_server(current_user)
    movie = plex_server.fetchItem(ekey=int(movie_id))
    movie.reload()
    return plex_movie_serializer.jsonify(movie)


@login_required
def get_recent_series():
    plex_server = utils.user_server(current_user)
    series_section = utils.library_sections(plex_server, section_type="series")
    recent_series = [
        series
        for section in series_section
        for series in section.recentlyAdded(maxresults=20)
    ]
    return plex_episode_serializer.jsonify(recent_series, many=True)


@login_required
def get_series(series_id):
    plex_server = utils.user_server(current_user)
    series = plex_server.fetchItem(ekey=int(series_id))
    series.reload()
    return plex_series_serializer.jsonify(series)


@login_required
def get_season(series_id, season_number):
    plex_server = utils.user_server(current_user)
    series = plex_server.fetchItem(ekey=int(series_id))
    season = series.season(title=int(season_number))
    season.reload()
    return plex_season_serializer.jsonify(season)


@login_required
def get_episode(series_id, season_number, episode_number):
    plex_server = utils.user_server(current_user)
    series = plex_server.fetchItem(ekey=int(series_id))
    episode = series.episode(season=int(season_number), episode=int(episode_number))
    episode.reload()
    return plex_episode_serializer.jsonify(episode)


@login_required
def get_on_deck():
    plex_server = utils.user_server(current_user)
    on_deck = plex_server.library.onDeck()
    on_deck = [
        plex_movie_serializer.dump(media)
        if isinstance(media, Movie)
        else plex_episode_serializer.dump(media)
        for media in on_deck
    ]
    return jsonify(on_deck)
