from http import HTTPStatus

from flask import request
from flask_login import current_user, login_required
from sqlalchemy import or_

from server.auth.models import User
from server.exceptions import HTTPError
from server.profile.forms import UsernameOrEmailForm
from server.profile.serializers import profiles_serializer
from server.providers.utils import plex
from server.search import search
from server.search.forms import MediaSearchForm
from server.search.serializers import media_search_serializer


@search.route("/friends/")
@login_required
def search_friends():
    username_or_email = UsernameOrEmailForm(request.args)
    if not username_or_email.validate():
        raise HTTPError(
            "Error while searching user.",
            status_code=HTTPStatus.BAD_REQUEST,
            payload=username_or_email.errors,
        )
    result = []
    for user in (
        User.query.filter(
            or_(
                User.username.contains(username_or_email.usernameOrEmail.data),
                User.email.contains(username_or_email.usernameOrEmail.data),
            )
        )
        .limit(5)
        .all()
    ):
        if user in current_user.friends_received or user in current_user.friends_sent:
            result.append(user)
    return profiles_serializer.jsonify(result, many=True)


@search.route("/media/")
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
    filters = {
        field: value for field, value in media_search.data.items() if field != "type"
    }

    if plex_server is None:
        raise HTTPError("No Plex server linked.", status_code=HTTPStatus.BAD_REQUEST)
    result = plex.search(
        plex_server, section_type=media_search.type.data, filters=filters
    )
    return media_search_serializer.jsonify(result), HTTPStatus.OK
