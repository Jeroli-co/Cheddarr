from typing import Optional

from plexapi.exceptions import PlexApiException
from plexapi.library import LibrarySection, MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer as PlexAPIServer

from server.schemas import PlexServerInfo


def get_servers(plex_api_key) -> list[PlexServerInfo]:
    plex_account = MyPlexAccount(plex_api_key)
    return [
        PlexServerInfo(
            server_id=resource.clientIdentifier,
            server_name=resource.name,
        )
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]


def get_server(api_key: str, name: str) -> Optional[PlexAPIServer]:
    try:
        server = MyPlexAccount(api_key).resource(name).connect()
    except PlexApiException:
        return None
    return server


def library_sections(
    plex_server: PlexAPIServer, section_type: str = None
) -> list[LibrarySection]:
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


def search(
    plex_server: PlexAPIServer,
    section_type: str,
    title: str,
    max_results=3,
):
    if section_type == "movies":
        sections = library_sections(plex_server, section_type="movies")
    elif section_type == "series":
        sections = library_sections(plex_server, section_type="series")
    else:
        sections = library_sections(plex_server)
    result = [
        media
        for section in sections
        for media in section.search(maxresults=max_results, title=title)
    ]
    return result
