from typing import List

from plexapi.myplex import MyPlexAccount

from server.schemas import PlexServer


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
