from requests import get

from server.models import RadarrConfig
from server.utils import make_url


def radarr_url(config: RadarrConfig, resource_path: str, queries: dict = None) -> str:
    queries = queries or {}
    port = config.port
    return make_url(
        "%s://%s%s/api%s"
        % (
            "https" if config.ssl else "http",
            config.host,
            f":{port}" if port else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": config.api_key},
    )


def test_radarr_status(config: RadarrConfig):
    url = radarr_url(config, "/system/status")
    try:
        r = get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def radarr_lookup(tmdb_id: int, config: RadarrConfig):
    url = radarr_url(
        config,
        "/movie/lookup/tmdb",
        queries={"tmdbId": tmdb_id},
    )
    lookup = get(url).json()
    return lookup
