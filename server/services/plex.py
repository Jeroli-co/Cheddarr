from typing import List, Optional

from plexapi.exceptions import PlexApiException
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer as PlexAPIServer

from server.schemas.settings import PlexLibrarySection, PlexServer


def get_plex_account_servers(api_key: str) -> List[PlexServer]:
    plex_account = MyPlexAccount(api_key)
    servers = []
    for resource in plex_account.resources():
        if resource.provides == "server":
            for connection in resource.connections:
                if not connection.relay:
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


def get_plex_server_library_sections(
    base_url: str, port: int, ssl: bool, api_key: str
) -> Optional[List[PlexLibrarySection]]:
    server = get_server(base_url, port, ssl, api_key)
    if server is None:
        return None
    sections = []
    for library in server.library.sections():
        sections.append(PlexLibrarySection(library_id=library.key, name=library.title))

    return sections


def get_plex_library_section(server: PlexAPIServer, section_name: str):
    return server.library.section(section_name)


def get_server(base_url: str, port: int, ssl: bool, api_key: str) -> Optional[PlexAPIServer]:
    url = f"{'https' if ssl else 'http'}://{base_url}{':' + str(port) if port else ''}"
    try:
        server = PlexAPIServer(url, api_key, timeout=10)
    except PlexApiException:
        return None
    return server
