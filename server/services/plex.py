from typing import Any

from asgiref.sync import sync_to_async
from plexapi.exceptions import PlexApiException
from plexapi.myplex import MyPlexAccount
from plexapi.server import PlexServer as PlexAPIServer

from server.core import utils
from server.core.config import Config
from server.core.http_client import HttpClient
from server.models.settings import PlexSetting
from server.repositories.settings import PlexSettingRepository
from server.schemas.plex import PlexUser
from server.schemas.settings import PlexLibrarySection, PlexServer
from server.services.base import BaseService


class PlexService(BaseService):
    def __init__(
        self,
        plex_setting_repo: PlexSettingRepository,
    ) -> None:
        self.plex_setting_repo = plex_setting_repo

    @staticmethod
    def get_dependencies() -> list[Any]:
        return [
            PlexSettingRepository,
        ]

    @staticmethod
    async def get_user(config: Config, state: str, code: str) -> PlexUser:
        access_url = utils.make_url(
            config.plex_token_url + state,
            queries_dict={
                "code": code,
                "X-Plex-Client-Identifier": config.client_id,
            },
        )

        resp = await HttpClient.get(access_url, headers={"Accept": "application/json"})
        auth_token = resp.get("authToken")
        resp = await HttpClient.get(
            config.plex_user_resource_url,
            headers={"X-Plex-Token": auth_token, "Accept": "application/json"},
        )

        return PlexUser(
            id=resp["id"],
            email=resp["email"],
            username=resp["username"],
            thumb=resp["thumb"],
            api_key=auth_token,
        )

    @staticmethod
    async def get_account_servers(api_key: str) -> list[PlexServer]:
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
                            ),
                        )
        return servers

    @staticmethod
    async def get_server(base_url: str, port: int | None, ssl: bool, api_key: str) -> PlexAPIServer | None:
        url = f"{'https' if ssl else 'http'}://{base_url}{':' + str(port) if port else ''}"
        try:
            server = await sync_to_async(PlexAPIServer)(url, api_key)
        except PlexApiException:
            return None
        return server

    @classmethod
    async def get_server_library_sections(
        cls,
        base_url: str,
        port: int | None,
        ssl: bool,
        api_key: str,
    ) -> list[PlexLibrarySection] | None:
        server = await cls.get_server(base_url, port, ssl, api_key)
        if server is None:
            return None
        sections = []
        for library in await sync_to_async(server.library.sections)():
            sections.append(PlexLibrarySection(library_id=library.key, name=library.title))

        return sections

    async def get_settings(self) -> list[PlexSetting]:
        return await self.plex_setting_repo.find_by().all()

    async def get_setting(self, server_id: str) -> PlexSetting | None:
        return await self.plex_setting_repo.find_by(server_id=server_id).one()
