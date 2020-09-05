from typing import List, Type

from plexapi.exceptions import PlexApiException
from plexapi.library import LibrarySection, MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer
from server.api.providers.plex.models import PlexConfig
from server.extensions import cache
from werkzeug.exceptions import BadRequest, InternalServerError


@cache.memoize(timeout=300)
def user_server(user) -> PlexServer:
    plex_config = PlexConfig.find(user=user)
    if not plex_config:
        raise InternalServerError("No existing config for Plex.")
    plex_servers = plex_config.servers[0]
    if not plex_servers:
        raise BadRequest("No Plex server linked.")
    api_key = plex_config.api_key
    server_name = plex_servers.name
    if server_name is None:
        raise BadRequest("No Plex server linked.")
    try:
        return MyPlexAccount(api_key).resource(server_name).connect()
    except PlexApiException:
        raise InternalServerError("Error while connecting to Plex server.")


@cache.memoize(timeout=300)
def library_sections(
    plex_server: PlexServer, section_id=None, section_type=None
) -> List[Type[LibrarySection]]:
    if section_id is not None:
        # TODO get section by id
        pass
    if section_type == "movies":
        libtype = MovieSection
    elif section_type == "series":
        libtype = ShowSection
    else:
        libtype = LibrarySection
    sections = [
        section
        for section in plex_server.library.sections()
        if isinstance(section, libtype)
    ]
    return sections


@cache.memoize(timeout=300)
def search(plex_server, section_type, title, filters, max_results=3):
    if section_type == "movies":
        sections = library_sections(plex_server, section_type="movies")
    elif section_type == "series":
        sections = library_sections(plex_server, section_type="series")
    else:
        sections = library_sections(plex_server)
    result = [
        media
        for section in sections
        for media in section.search(maxresults=max_results, title=title, **filters)
    ]
    return result
