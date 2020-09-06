from flask import jsonify
from flask_login import current_user, login_required
from server.api.auth.models import User
from server.api.providers.models import ProviderConfig, ProviderType
from server.api.providers.plex import utils
from server.api.search.schemas import (
    FriendSearchResultSchema,
    MediaSearchResultSchema,
    SearchSchema,
)
from server.api.search.tmdb.schemas import TmdbSearchResultSchema
from server.extensions.marshmallow import query
from sqlalchemy import or_

from .tmdb import tmdb_search

tmdb_result_serializer = TmdbSearchResultSchema()


@login_required
@query(SearchSchema)
def search_all(value, type=None, **kwargs):
    if type == "friends":
        return jsonify(search_friends(value))
    providers = [
        provider
        for provider in ProviderConfig.findAll(user=current_user)
        if provider.provider_type == ProviderType.MEDIA_SERVER
    ]
    if not any(
        provider.enabled and len(provider.servers) != 0 for provider in providers
    ):
        return jsonify([])
    if type == "movies" or type == "series":
        return jsonify(search_media(value, type))
    return jsonify(search_friends(value) + search_media(value, type, filters=kwargs))


def search_friends(name):
    result = []
    for user in (
        User.query.filter(or_(User.username.contains(name), User.email.contains(name)))
        .limit(3)
        .all()
    ):
        if user in current_user.friends_received or user in current_user.friends_sent:
            result.append(user)
    return FriendSearchResultSchema().dump(result, many=True)


def search_media(title, section=None, filters=None):
    filters = filters or {}
    plex_server = utils.user_server(current_user)
    result = utils.search(
        plex_server, section_type=section, title=title, filters=filters
    )
    return MediaSearchResultSchema().dump(result, many=True)


@login_required
@query(SearchSchema)
def search_online_media(value, page=1):
    results = tmdb_search.multi(query=value, page=page)
    return tmdb_result_serializer.jsonify(results)


@login_required
@query(SearchSchema)
def search_online_movies(value, page=1):
    results = tmdb_search.movie(query=value, page=page)
    return tmdb_result_serializer.jsonify(results)


@login_required
@query(SearchSchema)
def search_online_series(value, page=1):
    results = tmdb_search.tv(query=value, page=page)
    return tmdb_result_serializer.jsonify(results)
