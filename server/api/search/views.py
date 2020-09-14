import tmdbsimple as tmdb
from flask import jsonify
from flask_login import login_required
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
)

tmdb_search = tmdb.Search()


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
def search_media_online(value, page=1):
    results = tmdb_search.multi(query=value, page=page)
    return TmdbMediaSearchResultSchema().jsonify(results)


@login_required
@query(SearchSchema)
@cache.memoize(timeout=3600)
def search_movies_online(value, page=1):
    results = tmdb_search.movie(query=value, page=page)
    return TmdbMovieSearchResultSchema().jsonify(results)


@login_required
@query(SearchSchema)
@cache.memoize(timeout=3600)
def search_series_online(value, page=1):
    results = tmdb_search.tv(query=value, page=page)
    return TmdbSeriesSearchResultSchema().jsonify(results)
