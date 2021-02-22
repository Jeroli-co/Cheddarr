from typing import List, Optional

from plexapi.exceptions import PlexApiException
from plexapi.library import LibrarySection, MovieSection, ShowSection
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer as PlexAPIServer

from server.schemas import PlexServer


def get_plex_account_servers(api_key: str) -> List[PlexServer]:
    plex_account = MyPlexAccount(api_key)
    servers = []
    for resource in plex_account.resources():
        if resource.provides == "server":
            for connection in resource.connections:
                servers.append(
                    PlexServer(
                        server_id=resource.clientIdentifier,
                        server_name=resource.name + " [local]"
                        if connection.local
                        else resource.name + " [remote]",
                        api_key=resource.accessToken,
                        host=connection.address,
                        port=connection.port,
                        ssl=connection.protocol == "HTTPS",
                        local=connection.local,
                    )
                )
    return servers


def get_server(base_url: str, port: int, ssl: bool, api_key: str) -> Optional[PlexAPIServer]:
    url = f"{'https' if ssl else 'http'}://{base_url}{':' + str(port) if port else ''}"
    try:
        server = PlexAPIServer(url, api_key, timeout=15)
    except PlexApiException:
        return None
    return server


def library_sections(plex_server: PlexAPIServer, section_type: str = None) -> List[LibrarySection]:
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
