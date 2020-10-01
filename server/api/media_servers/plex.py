from flask import jsonify
from flask_login import current_user, fresh_login_required, login_required
from plexapi.myplex import MyPlexAccount
from plexapi.video import Movie
from werkzeug.exceptions import BadRequest, Unauthorized

from server.extensions.marshmallow import body, jsonify_with
from server.helpers.media_servers.plex import (
    connect_plex_servers,
    plex_library_sections,
)
from server.models import PlexConfig, PlexServer
from server.schemas import (
    PlexConfigSchema,
    PlexEpisodeSchema,
    PlexMovieSchema,
    PlexSeasonSchema,
    PlexSeriesSchema,
    PlexServerSchema,
)
from .base import media_servers_bp

plex_config_serializer = PlexConfigSchema()
plex_movie_serializer = PlexMovieSchema()
plex_series_serializer = PlexSeriesSchema()
plex_season_serializer = PlexSeasonSchema()
plex_episode_serializer = PlexEpisodeSchema()


@media_servers_bp.route("/plex/status/")
@login_required
def get_plex_status():
    plex_config = PlexConfig.find(user=current_user)
    return {"status": plex_config is not None and len(plex_config.servers) != 0}


@media_servers_bp.route("/plex/config/")
@login_required
@jsonify_with(PlexConfigSchema)
def get_plex_config():
    plex_config = PlexConfig.find(user=current_user)
    if not plex_config:
        return {}
    return plex_config


@media_servers_bp.route("/plex/config/", methods=["PATCH"])
@login_required
@body(PlexConfigSchema)
@jsonify_with(PlexConfigSchema)
def update_plex_config(args):
    plex_config = PlexConfig.find(user=current_user)
    if not plex_config:
        raise BadRequest("No existing Plex config.")
    plex_config.update(args)
    return plex_config


@media_servers_bp.route("/plex/config/", methods=["DELETE"])
@fresh_login_required
def unlink_plex_account():
    plex_config = PlexConfig.find(user=current_user)
    if not plex_config:
        raise BadRequest("No Plex account linked.")
    plex_config.delete()
    return {"message": "Plex account unlinked."}


@media_servers_bp.route("/plex/config/servers/", methods=["POST"])
@login_required
@body(PlexServerSchema)
@jsonify_with(PlexConfigSchema)
def add_plex_server(server):
    plex_config = PlexConfig.find(user=current_user)
    if not plex_config:
        raise BadRequest("No existing Plex config.")
    plex_config.servers.append(server)
    plex_config.save()
    return plex_config


@media_servers_bp.route("/plex/config/servers/<machine_id>/", methods=["DELETE"])
@login_required
@jsonify_with(PlexConfigSchema)
def remove_plex_server(machine_id):
    plex_config = PlexConfig.find(user=current_user)
    if not plex_config:
        raise BadRequest("No existing Plex config.")
    plex_server = PlexServer.find(machine_id=machine_id)
    if not plex_server:
        raise BadRequest("This server is not linked.")
    if plex_server not in plex_config.servers:
        raise Unauthorized("This server is not linked to you account.")
    plex_config.servers.remove(plex_server)
    if not plex_server.configs:
        plex_server.delete()
    plex_config.save()
    return plex_config


@media_servers_bp.route("/plex/servers/")
@login_required
def get_plex_servers():
    plex_config = PlexConfig.find(user=current_user)
    if not plex_config:
        raise BadRequest("No existing Plex config.")
    api_key = plex_config.api_key
    plex_account = MyPlexAccount(api_key)
    servers = [
        {"name": resource.name, "machine_id": resource.clientIdentifier}
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]
    return jsonify(servers)


@media_servers_bp.route("/plex/movies/recent/")
@login_required
@jsonify_with(PlexMovieSchema, many=True)
def get_plex_recent_movies():
    plex_server = connect_plex_servers(current_user)
    movie_sections = plex_library_sections(plex_server, section_type="movies")
    recent_movies = [
        movie
        for section in movie_sections
        for movie in section.recentlyAdded(maxresults=20)
    ]
    return recent_movies


@media_servers_bp.route("/plex/movies/<int:movie_id>/")
@login_required
@jsonify_with(PlexMovieSchema)
def get_plex_movie(movie_id):
    plex_server = connect_plex_servers(current_user)
    movie = plex_server.fetchItem(ekey=int(movie_id))
    movie.reload()
    return movie


@media_servers_bp.route("/plex/series/recent/")
@login_required
@jsonify_with(PlexEpisodeSchema, many=True)
def get_plex_recent_series():
    plex_server = connect_plex_servers(current_user)
    series_section = plex_library_sections(plex_server, section_type="series")
    recent_series = [
        series
        for section in series_section
        for series in section.recentlyAdded(maxresults=20)
    ]
    return recent_series


@media_servers_bp.route("/plex/series/<int:series_id>/")
@login_required
@jsonify_with(PlexSeriesSchema)
def get_plex_series(series_id):
    plex_server = connect_plex_servers(current_user)
    series = plex_server.fetchItem(ekey=series_id)
    series.reload()
    return series


@media_servers_bp.route("/plex/seasons/<int:season_id>/")
@login_required
@jsonify_with(PlexSeasonSchema)
def get_plex_season(season_id):
    plex_server = connect_plex_servers(current_user)
    season = plex_server.fetchItem(ekey=season_id)
    season.reload()
    return season


@media_servers_bp.route("/plex/episodes/<int:episode_id>/")
@login_required
@jsonify_with(PlexEpisodeSchema)
def get_plex_episode(episode_id):
    plex_server = connect_plex_servers(current_user)
    episode = plex_server.fetchItem(ekey=episode_id)
    episode.reload()
    return episode


@media_servers_bp.route("/plex/on-deck/")
@login_required
def get_plex_on_deck():
    plex_server = connect_plex_servers(current_user)
    on_deck = plex_server.library.onDeck()
    on_deck = [
        plex_movie_serializer.dump(media)
        if isinstance(media, Movie)
        else plex_episode_serializer.dump(media)
        for media in on_deck
    ]
    return jsonify(on_deck)
