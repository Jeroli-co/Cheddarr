from typing import Union

from requests import get

from server.models import RadarrConfig
from server.core import utils


def make_url(
    *,
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
    resource_path: str,
    queries: dict = None,
) -> str:
    queries = queries or {}
    port = port
    return utils.make_url(
        "%s://%s%s/api%s"
        % (
            "https" if ssl else "http",
            host,
            f":{port}" if port else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": api_key},
    )


def check_instance_status(
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
) -> Union[bool, dict]:
    url = make_url(
        api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/system/status"
    )
    try:
        r = get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def lookup(config: RadarrConfig, tmdb_id: int):
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        resource_path="/movie/lookup/tmdb",
        queries={"tmdbId": tmdb_id},
    )
    lookup_result = get(url).json()
    return lookup_result
