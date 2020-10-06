import tmdbsimple as tmdb
from flask import jsonify, Blueprint
from flask_login import login_required
from requests import HTTPError
from werkzeug.exceptions import abort, NotFound

from server.extensions import cache
from server.extensions.marshmallow import query, jsonify_with
from server.helpers.search import (
    search_friends,
    search_media,
    set_tmdb_series_info,
)
from server.schemas.search import (
    FriendSearchResultSchema,
    MediaSearchResultSchema,
    SearchSchema,
    TmdbEpisodeSchema,
    TmdbMediaSearchResultSchema,
    TmdbMovieSearchResultSchema,
    TmdbSeriesSearchResultSchema,
    TmdbMovieSchema,
    TmdbSeriesSchema,
    TmdbSeasonSchema,
)

search_bp = Blueprint("search", __name__)


@search_bp.route("/")
@login_required
@query(SearchSchema)
def search_all(value, type=None, **kwargs):
    if type == "friends":
        return FriendSearchResultSchema().jsonify(search_friends(value), many=True)

    if type == "movies" or type == "series":
        return MediaSearchResultSchema().jsonify(search_media(value, type), many=True)

    return jsonify(
        FriendSearchResultSchema().dump(search_friends(value), many=True)
        + MediaSearchResultSchema().dump(
            search_media(value, type, filters=kwargs), many=True
        )
    )


@search_bp.route("/all/")
@login_required
@query(SearchSchema)
@jsonify_with(TmdbMediaSearchResultSchema)
@cache.memoize(timeout=3600)
def search_tmdb_media(value, page=1):
    results = tmdb.Search().multi(query=value, page=page)
    set_tmdb_series_info(series=results["results"])
    return results


@search_bp.route("/movies/")
@login_required
@query(SearchSchema)
@jsonify_with(TmdbMovieSearchResultSchema)
@cache.memoize(timeout=3600)
def search_tmdb_movies(value, page=1):
    results = tmdb.Search().movie(query=value, page=page)
    return results


@search_bp.route("/series/")
@login_required
@query(SearchSchema)
@jsonify_with(TmdbSeriesSearchResultSchema)
@cache.memoize(timeout=3600)
def search_tmdb_series(value, page=1):
    results = tmdb.Search().tv(query=value, page=page)
    set_tmdb_series_info(series=results["results"])
    return results


@search_bp.route("/movies/<int:tmdb_id>/")
@login_required
@jsonify_with(TmdbMovieSchema)
@cache.memoize(timeout=3600)
def get_tmdb_movie(tmdb_id):
    try:
        movie = tmdb.Movies(tmdb_id).info()
        return movie
    except HTTPError as e:
        abort(e.response.status_code)


@search_bp.route("/series/<int:tvdb_id>/")
@login_required
@cache.memoize(timeout=3600)
@jsonify_with(TmdbSeriesSchema)
def get_tmdb_series_by_tvdb_id(tvdb_id):

    tmdb_result = tmdb.Find(tvdb_id).info(external_source="tvdb_id").get("tv_results")
    if not tmdb_result:
        raise NotFound("No series found.")
    tmdb_id = tmdb_result[0]["id"]
    try:
        series = tmdb.TV(tmdb_id).info()
        set_tmdb_series_info(series=series)
        return series
    except HTTPError as e:
        abort(e.response.status_code)


@search_bp.route("/series/<int:tvdb_id>/seasons/<int:season_number>/")
@login_required
@jsonify_with(TmdbSeasonSchema)
@cache.memoize(timeout=3600)
def get_tmdb_season_by_tvdb_id(tvdb_id, season_number):
    tmdb_result = tmdb.Find(tvdb_id).info(external_source="tvdb_id").get("tv_results")
    if not tmdb_result:
        raise NotFound("No series found.")
    tmdb_id = tmdb_result[0]["id"]
    try:
        season = tmdb.TV_Seasons(tmdb_id, season_number).info()
        return season
    except HTTPError as e:
        abort(e.response.status_code)


@search_bp.route(
    "/series/<int:tvdb_id>/seasons/<int:season_number>/episodes/<int:episode_number>"
)
@login_required
@jsonify_with(TmdbEpisodeSchema)
@cache.memoize(timeout=3600)
def get_tmdb_episode_by_tvdb_id(tvdb_id, season_number, episode_number):
    tmdb_result = tmdb.Find(tvdb_id).info(external_source="tvdb_id").get("tv_results")
    if not tmdb_result:
        raise NotFound("No series found.")
    tmdb_id = tmdb_result[0]["id"]
    try:
        episode = tmdb.TV_Episodes(tmdb_id, season_number, episode_number).info()
        return episode
    except HTTPError as e:
        abort(e.response.status_code)
