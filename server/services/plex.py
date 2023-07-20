from asgiref.sync import sync_to_async
from plexapi.exceptions import PlexApiException
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer as PlexAPIServer

from server.core import utils
from server.core.config import Config
from server.core.http_client import HttpClient
from server.schemas.plex import PlexUser
from server.schemas.settings import PlexLibrarySection, PlexServer


async def get_user(config: Config, key: int, code: str) -> PlexUser:
    access_url = utils.make_url(
        f"{config.plex_token_url!s}{key}",
        queries_dict={
            "code": code,
            "X-Plex-Client-Identifier": config.client_id,
        },
    )

    resp = await HttpClient.get(access_url, headers={"Accept": "application/json"})
    auth_token = resp.get("authToken")
    resp = await HttpClient.get(
        str(config.plex_user_resource_url),
        headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
    )

    return PlexUser(
        id=resp["id"],
        email=resp["email"],
        username=resp["username"],
        thumb=resp["thumb"],
        api_key=auth_token,
    )


async def get_account_servers(api_key: str) -> list[PlexServer]:
    plex_account = MyPlexAccount(api_key)
    return [
        PlexServer(
            server_id=resource.clientIdentifier,
            server_name=resource.name + " [local]" if connection.local else resource.name + " [remote]",
            api_key=resource.accessToken,
            host=connection.address,
            port=connection.port,
            ssl=connection.protocol == "HTTPS",
            local=connection.local,
        )
        for resource in plex_account.resources()
        if resource.provides == "server"
        for connection in resource.connections
        if not connection.relay
    ]


async def get_server(base_url: str, port: int | None, ssl: bool, api_key: str) -> PlexAPIServer | None:
    url = f"{'https' if ssl else 'http'}://{base_url}{':' + str(port) if port else ''}"
    try:
        server = await sync_to_async(PlexAPIServer)(url, api_key)
    except PlexApiException:
        return None
    return server


async def get_server_library_sections(
    base_url: str,
    port: int | None,
    ssl: bool,
    api_key: str,
) -> list[PlexLibrarySection] | None:
    server = await get_server(base_url, port, ssl, api_key)
    if server is None:
        return None
    return [
        PlexLibrarySection(library_id=str(library.key), name=library.title)
        for library in await sync_to_async(server.library.sections)()
    ]
