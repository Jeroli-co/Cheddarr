from typing import Optional, List

from plexapi.exceptions import PlexApiException
from plexapi.library import LibrarySection, MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer

from server.schemas import PlexServerInfo, PlexServerOut


def get_plex_account_servers(api_key: str) -> List[PlexServerInfo]:
    plex_account = MyPlexAccount(api_key)
    return [
        PlexServerInfo(
            server_id=resource.clientIdentifier,
            server_name=resource.name,
        )
        for resource in plex_account.resources()
        if resource.provides == "server"
    ]


def get_plex_account_server(api_key: str, name: str) -> Optional[PlexServerOut]:
    try:
        server = MyPlexAccount(api_key).resource(name)
        server_con = next(s for s in server.connections if s.local)
        server_out = PlexServerOut(
            host=server_con.address,
            port=server_con.port,
            ssl=True if server_con.protocol == "HTTPS" else False,
            api_key=server.accessToken,
            server_id=server.clientIdentifier,
            server_name=server.name,
        )
    except PlexApiException:
        return None
    return server_out


def get_server(base_url: str, port: int, ssl: bool, api_key: str) -> Optional[PlexServer]:
    url = f"{'https' if ssl else 'http'}://{base_url}{':' + str(port) if port else ''}"
    try:
        server = PlexServer(url, api_key)
    except PlexApiException:
        return None
    return server


def library_sections(plex_server: PlexServer, section_type: str = None) -> List[LibrarySection]:
    if section_type == "movies":
        libtype = MovieSection
    elif section_type == "series":
        libtype = ShowSection
    else:
        libtype = LibrarySection
    sections = [
        section for section in plex_server.library.sections() if isinstance(section, libtype)
    ]
    return sections


def search(
    plex_server: PlexServer,
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
