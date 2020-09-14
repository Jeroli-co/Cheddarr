from server.api.providers.plex.helpers import connect_plex_servers, plex_search
from werkzeug.exceptions import BadRequest
from server.api.users.models import User
from flask_login import current_user


def search_friends(name, limit=3):
    result = []
    search = User.search("username", name)
    current_friends = current_user.friends
    for user in search:
        if user in current_friends:
            result.append(user)
    return result


def search_media(title, section=None, filters=None):
    filters = filters or {}
    try:
        plex_server = connect_plex_servers(current_user)
    except BadRequest:
        return []
    result = plex_search(
        plex_server, section_type=section, title=title, filters=filters
    )
    return result
