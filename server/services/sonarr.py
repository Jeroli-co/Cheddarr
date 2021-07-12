import asyncio
from typing import Dict, List, Optional

from fastapi import HTTPException
from pydantic.tools import parse_obj_as

from server.core import utils
from server.core.http_client import HttpClient
from server.models.media import SeriesType
from server.models.requests import SeriesRequest
from server.models.settings import SonarrSetting
from server.schemas.external_services import SonarrAddOptions, SonarrEpisode, SonarrSeries
from server.schemas.settings import SonarrInstanceInfo


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


async def check_instance_status(
    api_key: str, host: str, port: int, ssl: bool, version: int = None
) -> Optional[Dict]:
    url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        version=version,
        resource_path="/system/status",
    )
    try:
        resp = await HttpClient.request("GET", url)
    except HTTPException:
        return None
    return resp


async def get_instance_info(
    api_key: str, host: str, port: int, ssl: bool, version: int = None
) -> Optional[SonarrInstanceInfo]:
    test = await check_instance_status(
        api_key=api_key, host=host, port=port, ssl=ssl, version=version
    )
    if not test:
        return None

    root_folder_url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        version=3,
        resource_path="/rootFolder",
    )

    if version == 3:
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
            for profile in await HttpClient.request("GET", language_profile_url)
        ]
    else:
        quality_profile_url = make_url(
            api_key=api_key, host=host, port=port, ssl=ssl, resource_path="/profile"
        )
        language_profiles = None

    root_folders = [folder["path"] for folder in await HttpClient.request("GET", root_folder_url)]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]}
        for profile in await HttpClient.request("GET", quality_profile_url)
    ]
    return SonarrInstanceInfo(
        version=version,
        quality_profiles=quality_profiles,
        language_profiles=language_profiles,
        root_folders=root_folders,
    )


async def lookup(
    setting: SonarrSetting,
    tvdb_id: int,
) -> Optional[SonarrSeries]:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    lookup_result = await HttpClient.request("GET", url)
    if not isinstance(lookup_result, list):
        return None
    return SonarrSeries.parse_obj(lookup_result[0])


async def get_series(setting: SonarrSetting, series_id: int) -> Optional[SonarrSeries]:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path=f"/series/{series_id}",
    )
    try:
        resp = await HttpClient.request("GET", url)
    except HTTPException:
        return None
    return SonarrSeries.parse_obj(resp)


async def add_series(setting: SonarrSetting, series: SonarrSeries) -> SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series",
    )
    resp = await HttpClient.request(
        "POST", url, data=series.json(by_alias=True, exclude_none=True)
    )
    return SonarrSeries.parse_obj(resp)


async def update_series(setting: SonarrSetting, series: SonarrSeries) -> SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series",
    )
    resp = await HttpClient.request("PUT", url, data=series.json(by_alias=True, exclude_none=True))
    return SonarrSeries.parse_obj(resp)


async def get_episodes(setting: SonarrSetting, series_id: int) -> List[SonarrEpisode]:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/episode",
        queries={"seriesId": series_id},
    )
    resp = await HttpClient.request("GET", url)
    return parse_obj_as(List[SonarrEpisode], resp)


async def update_episode(setting: SonarrSetting, episode: SonarrEpisode) -> SonarrEpisode:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path=f"/episode/{episode.id}",
    )
    resp = await HttpClient.request(
        "PUT", url, data=episode.json(by_alias=True, exclude_none=True)
    )
    return SonarrEpisode.parse_obj(resp)


async def send_request(request: SeriesRequest):
    setting: SonarrSetting = request.selected_provider
    series = await lookup(setting, request.media.tvdb_id)
    if series is None:
        return
    if series.id is None:  # series is not added to sonarr yet.
        root_folder_path = request.root_folder or setting.root_folder
        quality_profile_id = request.quality_profile_id or setting.quality_profile_id
        language_profile_id = request.language_profile_id or setting.language_profile_id
        if series.series_type == SeriesType.anime:
            root_folder_path = setting.anime_root_folder or root_folder_path
            quality_profile_id = setting.anime_quality_profile_id or quality_profile_id
            language_profile_id = setting.anime_language_profile_id or language_profile_id
        series.root_folder_path = root_folder_path
        series.quality_profile_id = quality_profile_id
        if setting.version == 3:
            series.language_profile_id = language_profile_id
        series.add_options = SonarrAddOptions(
            ignore_episodes_with_files=True,
            ignore_episodes_without_files=False,
            search_for_missing_episodes=True,
        )
        for season in series.seasons:
            season.monitored = False
        series = await add_series(setting, series)
        # Wait for Sonarr to precess the newly added series
        await asyncio.sleep(2)
    else:
        series = await get_series(setting, series.id)
        if series is None:
            return
    # request seasons is empty so we are requesting all the series
    if not request.seasons:
        for season in series.seasons:
            season.monitored = True
        await update_series(setting, series)
    else:
        episodes = await get_episodes(setting, series.id)
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
                await update_episode(setting, episode)
        await update_series(setting, series)
