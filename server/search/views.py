from flask import jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import or_

from server.auth.models import User
from server.exceptions import BadRequest
from server.providers.utils import plex
from server.search import search
from server.search.forms import SearchForm
from server.search.serializers import media_search_serializer, friends_search_serializer


@search.route("/")
@login_required
def search():
    search_form = SearchForm(request.args)
    if not search_form.validate():
        raise BadRequest(
            "Error while searching.", payload=search_form.errors,
        )
    search_type = search_form.type.data
    if search_type == "friends":
        return jsonify(search_friends(search_form))
    if search_type == "movies" or search_type == "series":
        return jsonify(search_media(search_form))
    return jsonify(search_friends(search_form) + search_media(search_form))


def search_friends(search_form: SearchForm):
    value = search_form.value.data
    result = []
    for user in (
        User.query.filter(
            or_(User.username.contains(value), User.email.contains(value),)
        )
        .limit(5)
        .all()
    ):
        if user in current_user.friends_received or user in current_user.friends_sent:
            result.append(user)
    return friends_search_serializer.dump(result)


def search_media(search_form: SearchForm):
    plex_server = plex.user_server(current_user)
    value = search_form.value.data
    type = search_form.type.data
    filters = {
        field: value
        for field, value in search_form.data.items()
        if field != "type" and field != "value"
    }
    result = plex.search(plex_server, section_type=type, title=value, filters=filters)
    return media_search_serializer.dump(result)
