from typing import Union

from requests import get

from server.models import SonarrConfig
from server.utils import make_url


def sonarr_url(config: SonarrConfig, resource_path: str, queries: dict = None) -> str:
    queries = queries or {}
    port = config.port
    version = config.version
    return make_url(
        "%s://%s%s/api%s%s"
        % (
            "https" if config.ssl else "http",
            config.host,
            f":{port}" if port else "",
            f"/v{version}" if version else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": config.api_key},
    )


def test_sonarr_status(config: SonarrConfig) -> Union[bool, dict]:
    url = sonarr_url(config, "/system/status")
    try:
        r = get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def sonarr_lookup(tvdb_id: int, config: SonarrConfig) -> dict:
    url = sonarr_url(
        config,
        "/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    print(url)
    lookup = get(url).json()
    return lookup


def add_sonarr_series(config: SonarrConfig, lookup_result: dict):
    add_series_url = sonarr_url(
        config,
        "/series",
    )
    lookup_result["rootFolderPath"] = config.root_folder
    if config.version == 3:
        lookup_result["qualityProfileId"] = config.quality_profile_id
        lookup_result["languageProfileId"] = config.language_profile_id
    else:
        lookup_result["profileId"] = config.quality_profile_id

    for season in lookup_result["seasons"]:
        season["monitored"] = False
    print(lookup_result)
