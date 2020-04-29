from http import HTTPStatus

from flask import jsonify, request
from flask_login import current_user, login_required

from server.auth.models import User
from server.exceptions import HTTPError
from server.profile.serializers import profiles_serializer
from server.providers.utils import plex
from server.search import search
from server.search.forms import MediaSearchForm
from server.search.serializers import media_search_serializer


@search.route("/friends/")
@login_required
def search_friends():
    username = request.args.get("username")
    result = []
    for user in User.query.filter(User.username.contains(username)).all():
        if user in current_user.friends_received or user in current_user.friends_sent:
            result.append(user)
    return profiles_serializer.jsonify(result, many=True)


@search.route("/movies/")
@login_required
def search_movies():
    media_search = MediaSearchForm(request.args)
    if not media_search.validate():
        raise HTTPError(
            "Error while searching movies.",
            status_code=HTTPStatus.BAD_REQUEST,
            payload=media_search.errors,
        )
    plex_server = plex.user_server(current_user)
    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    result = plex.search(plex_server, section_type="movies", media_search=media_search)
    return media_search_serializer.jsonify(result), HTTPStatus.OK


@search.route("/series/")
@login_required
def search_series():
    pass
