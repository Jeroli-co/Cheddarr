from flask import jsonify
from flask_login import current_user, login_required
from sqlalchemy import or_

from server.api.auth.models import User
from server.extensions.marshmallow import query
from server.api.providers.plex import utils
from server.api.search.schemas import (
    FriendSearchResultSchema,
    MediaSearchResultSchema,
    SearchSchema,
)


@login_required
@query(SearchSchema)
def search_all(value, type=None, **kwargs):
    if type == "friends":
        return jsonify(search_friends(value))
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
