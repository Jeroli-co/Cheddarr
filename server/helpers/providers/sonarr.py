from typing import Union

from requests import get

from server.models import SonarrConfig, SeriesChildRequest
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
    lookup = get(url).json()
    return lookup


def add_series_to_sonarr(request: SeriesChildRequest):
    config = request.selected_provider
    lookup = sonarr_lookup(request.series.tvdb_id, config)[0]
    if not lookup.get("path"):  # Series not present

        lookup["rootFolderPath"] = config.root_folder
        if config.version == 3:
            lookup["qualityProfileId"] = config.quality_profile_id
            lookup["languageProfileId"] = config.language_profile_id
        else:
            lookup["profileId"] = config.quality_profile_id

        for season in lookup["seasons"]:
            season["monitored"] = False
        add_url = sonarr_url(config, "/series")
        # print(lookup)
        # print(request)
        for season in request.seasons:
            if not season.episodes:
                next(
                    (
                        item
                        for item in lookup["seasons"]
                        if item["seasonNumber"] == season.season_number
                    )
                )["monitored"] = True
            lookup["addOptions"] = {
                "ignoreEpisodesWithFiles": False,
                "ignoreEpisodesWithoutFiles": False,
                "searchForMissingEpisodes": False,
            }
        print(lookup)
        # res = post(add_url, data=json.dumps(lookup))
        # print(res.json())
