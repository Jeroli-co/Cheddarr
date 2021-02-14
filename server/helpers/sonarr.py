import time
from typing import List, Optional, Union

import requests
from pydantic.tools import parse_obj_as

from server import schemas
from server.core import utils
from server.models import (
    SeriesRequest,
    SeriesType,
    SonarrSetting,
)


def make_url(
    *,
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
    version: int = 2,
    resource_path: str,
    queries: dict = None,
) -> str:
    queries = queries or {}
    version = version if version == 3 else None
    return utils.make_url(
        "%s://%s%s/api%s%s"
        % (
            "https" if ssl else "http",
            host,
            f":{port}" if port else "",
            f"/v{version}" if version else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": api_key},
    )


def check_instance_status(api_key: str, host: str, port: int, ssl: bool) -> Union[bool, dict]:
    url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        resource_path="/system/status",
    )
    try:
        r = requests.get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def get_instance_info(
    api_key: str, host: str, port: int, ssl: bool
) -> Optional[schemas.SonarrInstanceInfo]:
    test = check_instance_status(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
    )
    if not test:
        return None

    version = int(test["version"][0])
    if version == 3:
        root_folder_url = make_url(
            api_key=api_key,
            host=host,
            port=port,
            ssl=ssl,
            version=3,
            resource_path="/rootFolder",
        )
        quality_profile_url = make_url(
            api_key=api_key,
            host=host,
            port=port,
            ssl=ssl,
            version=3,
            resource_path="/qualityprofile",
        )
        language_profile_url = make_url(
            api_key=api_key,
            host=host,
            port=port,
            ssl=ssl,
            version=3,
            resource_path="/languageprofile",
        )
        language_profiles = [
            {"id": profile["id"], "name": profile["name"]}
            for profile in requests.get(language_profile_url).json()
        ]
    else:
        root_folder_url = make_url(
            api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/rootFolder"
        )
        quality_profile_url = make_url(
            api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/profile"
        )
        language_profiles = None

    root_folders = [folder["path"] for folder in requests.get(root_folder_url).json()]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]}
        for profile in requests.get(quality_profile_url).json()
    ]
    return schemas.SonarrInstanceInfo(
        version=version,
        quality_profiles=quality_profiles,
        language_profiles=language_profiles,
        root_folders=root_folders,
    )


def lookup(
    setting: SonarrSetting,
    tvdb_id: int,
) -> schemas.SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    lookup_result = requests.get(url).json()[0]
    return schemas.SonarrSeries.parse_obj(lookup_result)


def get_series(setting: SonarrSetting, series_id: int) -> schemas.SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path=f"/series/{series_id}",
    )
    res = requests.get(url)
    return schemas.SonarrSeries.parse_obj(res.json())


def add_series(setting: SonarrSetting, series: schemas.SonarrSeries) -> schemas.SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series",
    )
    res = requests.post(url, data=series.json(by_alias=True, exclude_none=True))
    return schemas.SonarrSeries.parse_obj(res.json())


def update_series(setting: SonarrSetting, series: schemas.SonarrSeries) -> schemas.SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series",
    )
    res = requests.put(url, data=series.json(by_alias=True, exclude_none=True))
    return schemas.SonarrSeries.parse_obj(res.json())


def get_episodes(setting: SonarrSetting, series_id: int) -> List[schemas.SonarrEpisode]:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/episode",
        queries={"seriesId": series_id},
    )
    res = requests.get(url)
    return parse_obj_as(List[schemas.SonarrEpisode], res.json())


def update_episode(
    setting: schemas.SonarrSetting, episode: schemas.SonarrEpisode
) -> schemas.SonarrEpisode:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path=f"/episode/{episode.id}",
    )
    res = requests.put(url, data=episode.json(by_alias=True, exclude_none=True))
    return schemas.SonarrEpisode.parse_obj(res.json())


def send_request(request: SeriesRequest):
    setting: SonarrSetting = request.selected_provider
    series = lookup(setting, request.series.tvdb_id)
    if series.id is None:  # series is not added to sonarr yet.
        root_folder_path = setting.root_folder
        quality_profile_id = setting.quality_profile_id
        language_profile_id = setting.language_profile_id
        if series.series_type == SeriesType.anime:
            series.root_folder_path = setting.anime_root_folder or root_folder_path
            series.quality_profile_id = setting.anime_quality_profile_id or quality_profile_id
            series.language_profile_id = setting.anime_language_profile_id or language_profile_id
        series.root_folder_path = root_folder_path
        series.quality_profile_id = quality_profile_id
        if setting.version == 3:
            series.language_profile_id = language_profile_id
        series.add_options = schemas.SonarrAddOptions(
            ignore_episodes_with_files=False,
            ignore_episodes_without_files=False,
            search_for_missing_episodes=False,
        )
        for season in series.seasons:
            season.monitored = False
        series = add_series(setting, series)
        time.sleep(2)
    else:
        series = get_series(setting, series.id)
    # request seasons is empty so we are requesting all the series
    if not request.seasons:
        for season in series.seasons:
            season.monitored = True
        update_series(setting, series)
    else:
        episodes = get_episodes(setting, series.id)
        for req_season in request.seasons:
            season = next(s for s in series.seasons if s.season_number == req_season.season_number)
            if not req_season.episodes:
                season.monitored = True
                continue
            for req_episode in req_season.episodes:
                episode = next(
                    e
                    for e in episodes
                    if e.season_number == req_season.season_number
                    and e.episode_number == req_episode.episode_number
                )
                episode.monitored = True
                update_episode(setting, episode)
        update_series(setting, series)
