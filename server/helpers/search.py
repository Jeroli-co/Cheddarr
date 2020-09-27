from flask_login import current_user
from werkzeug.exceptions import BadRequest

from server.helpers.providers.plex import connect_plex_servers, plex_search
from server.models.users import User


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
