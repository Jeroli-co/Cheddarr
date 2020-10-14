from requests import get

from server.models import RadarrConfig
from server import utils


def make_url(config: RadarrConfig, resource_path: str, queries: dict = None) -> str:
    queries = queries or {}
    port = config.port
    return utils.make_url(
        "%s://%s%s/api%s"
        % (
            "https" if config.ssl else "http",
            config.host,
            f":{port}" if port else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": config.api_key},
    )


def check_status(config: RadarrConfig):
    url = make_url(config, "/system/status")
    try:
        r = get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def lookup(config: RadarrConfig, tmdb_id: int):
    url = make_url(
        config,
        "/movie/lookup/tmdb",
        queries={"tmdbId": tmdb_id},
    )
    lookup_result = get(url).json()
    return lookup_result
