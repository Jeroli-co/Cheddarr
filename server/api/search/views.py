import tmdbsimple as tmdb
from flask import jsonify
from flask_login import login_required
from requests import HTTPError
from werkzeug.exceptions import abort

from server.extensions import cache
from server.extensions.marshmallow import query
from .helpers import search_friends, search_media
from .schemas import (
    FriendSearchResultSchema,
    MediaSearchResultSchema,
    SearchSchema,
    TmdbMediaSearchResultSchema,
    TmdbMovieSearchResultSchema,
    TmdbSeriesSearchResultSchema,
    TmdbMovieSchema,
    TmdbSeriesSchema,
    TmdbSeasonSchema,
)


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


@login_required
@query(SearchSchema)
@cache.memoize(timeout=3600)
def search_tmdb_media(value, page=1):
    results = tmdb.Search().multi(query=value, page=page)
    return TmdbMediaSearchResultSchema().jsonify(results)


@login_required
@query(SearchSchema)
@cache.memoize(timeout=3600)
def search_tmdb_movies(value, page=1):
    results = tmdb.Search().movie(query=value, page=page)
    return TmdbMovieSearchResultSchema().jsonify(results)


@login_required
@query(SearchSchema)
@cache.memoize(timeout=3600)
def search_tmdb_series(value, page=1):
    results = tmdb.Search().tv(query=value, page=page)
    return TmdbSeriesSearchResultSchema().jsonify(results)


@login_required
@cache.memoize(timeout=3600)
def get_tmdb_movie(tmdb_id):
    try:
        movie = tmdb.Movies(tmdb_id).info()
    except HTTPError as e:
        abort(e.response.status_code)
        return {}
    return TmdbMovieSchema().jsonify(movie)


@login_required
@cache.memoize(timeout=3600)
def get_tmdb_series(tmdb_id):
    try:
        series = tmdb.TV(tmdb_id).info()
    except HTTPError as e:
        abort(e.response.status_code)
        return {}
    return TmdbSeriesSchema().jsonify(series)


@login_required
@cache.memoize(timeout=3600)
def get_tmdb_season(tmdb_id, season_number):
    try:
        season = tmdb.TV_Seasons(tmdb_id, season_number).info()
    except HTTPError as e:
        abort(e.response.status_code)
        return {}
    return TmdbSeasonSchema().jsonify(season)
