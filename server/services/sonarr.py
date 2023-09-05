import asyncio
from typing import Any

from fastapi import HTTPException
from loguru import logger
from pydantic import TypeAdapter

from server.core import utils
from server.core.http_client import HttpClient
from server.models.media import SeriesType
from server.models.requests import MediaRequest
from server.models.settings import SonarrSetting
from server.schemas.settings import SonarrInstanceInfo
from server.schemas.sonarr import SonarrAddOptions, SonarrEpisode, SonarrSeries


def make_url(
    *,
    api_key: str,
    host: str,
    port: int | None,
    ssl: bool,
    version: int | None = 3,
    resource_path: str,
    queries: dict[str, Any] | None = None,
) -> str:
    queries = queries or {}
    return utils.make_url(
        "{}://{}{}/api{}{}".format(
            "https" if ssl else "http",
            host,
            f":{port}" if port else "",
            f"/v{version}" if version else "",
            resource_path,
        ),
        queries_dict={**queries, "apikey": api_key},
    )


async def check_instance_status(
    api_key: str,
    host: str,
    port: int | None,
    ssl: bool,
    version: int | None = 3,
) -> dict[str, Any] | None:
    url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        version=version,
        resource_path="/system/status",
    )
    try:
        resp = await HttpClient.get(url)
    except HTTPException:
        return None
    return resp


async def get_instance_info(
    api_key: str,
    host: str,
    port: int | None,
    ssl: bool,
    version: int | None = 3,
) -> SonarrInstanceInfo | None:
    if not await check_instance_status(api_key=api_key, host=host, port=port, ssl=ssl, version=version):
        return None

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
        version=version,
        resource_path="/qualityprofile",
    )

    tags_url = make_url(
        api_key=api_key,
        host=host,
        port=port,
        ssl=ssl,
        version=3,
        resource_path="/tag",
    )

    root_folders = [folder["path"] for folder in await HttpClient.get(root_folder_url)]
    quality_profiles = [
        {"id": profile["id"], "name": profile["name"]} for profile in await HttpClient.get(quality_profile_url)
    ]
    tags = [{"id": tag["id"], "name": tag["label"]} for tag in await HttpClient.get(tags_url)]

    return SonarrInstanceInfo(
        version=version,
        quality_profiles=quality_profiles,
        root_folders=root_folders,
        tags=tags,
    )


async def lookup(setting: SonarrSetting, tvdb_id: int) -> SonarrSeries | None:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    lookup_result = await HttpClient.get(url)
    if not isinstance(lookup_result, list) or len(lookup_result) == 0:
        return None

    return SonarrSeries.model_validate(lookup_result[0])


async def get_series(setting: SonarrSetting, series_id: int) -> SonarrSeries | None:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path=f"/series/{series_id}",
    )
    try:
        resp = await HttpClient.get(url)
    except HTTPException:
        return None

    return SonarrSeries.model_validate(resp)


async def add_series(setting: SonarrSetting, series: SonarrSeries) -> SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series",
    )
    resp = await HttpClient.post(url, data=series.model_dump_json(by_alias=True, exclude_none=True))

    return SonarrSeries.model_validate(resp)


async def update_series(setting: SonarrSetting, series: SonarrSeries) -> SonarrSeries:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/series",
    )
    resp = await HttpClient.put(url, data=series.model_dump_json(by_alias=True, exclude_none=True))

    return SonarrSeries.model_validate(resp)


async def get_episodes(setting: SonarrSetting, series_id: int) -> list[SonarrEpisode]:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path="/episode",
        queries={"seriesId": series_id},
    )
    resp = await HttpClient.get(url)

    return TypeAdapter(list[SonarrEpisode]).validate_json(resp)


async def update_episode(setting: SonarrSetting, episode: SonarrEpisode) -> SonarrEpisode:
    url = make_url(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
        resource_path=f"/episode/{episode.id}",
    )
    resp = await HttpClient.put(url, data=episode.model_dump_json(by_alias=True, exclude_none=True))

    return SonarrEpisode.model_validate(resp)


async def send_request(request: MediaRequest) -> None:
    setting = SonarrSetting(**request.selected_provider.dict())

    if request.media.tvdb_id is None:
        logger.warning("series request was not sent because tvdb_id is None for %s", request.media.title)
        return

    series = await lookup(setting, request.media.tvdb_id)
    if series is None:
        logger.warning("series request was not sent because series was not found for %s", request.media.title)
        return

    if series.id is None:  # series is not added to sonarr yet.
        root_folder_path = request.root_folder or setting.root_folder
        quality_profile_id = request.quality_profile_id or setting.quality_profile_id
        tags = [int(tag) for tag in request.tags] or [int(tag) for tag in setting.tags] or []
        if series.series_type == SeriesType.anime:
            root_folder_path = setting.anime_root_folder or root_folder_path
            quality_profile_id = setting.anime_quality_profile_id or quality_profile_id
            tags = [int(tag) for tag in setting.anime_tags] or tags
        series.root_folder_path = root_folder_path
        series.quality_profile_id = quality_profile_id
        series.tags = tags
        series.add_options = SonarrAddOptions(
            ignoreEpisodesWithFiles=True,
            ignoreEpisodesWithoutFiles=False,
            searchForMissingEpisodes=False,
        )
        for season in series.seasons:
            season.monitored = False
        series = await add_series(setting, series)
        # Wait for Sonarr to precess the newly added series
        await asyncio.sleep(3)

    else:
        series = await get_series(setting, series.id)

    if series is None or series.id is None:
        logger.warning(
            "there was an error while creating the request for the series '%s' on Sonarr",
            request.media.title,
        )
        return

    series.add_options = SonarrAddOptions(
        ignoreEpisodesWithFiles=True,
        ignoreEpisodesWithoutFiles=False,
        searchForMissingEpisodes=True,
    )

    if not request.season_requests:  # Requested seasons list is empty, so we are requesting all the series
        for season in series.seasons:
            season.monitored = True
        await update_series(setting, series)
        return

    episodes = await get_episodes(setting, series.id)
    for req_season in request.season_requests:
        season = next(s for s in series.seasons if s.season_number == req_season.season_number)
        if not req_season.episode_requests:
            season.monitored = True
            continue
        for req_episode in req_season.episode_requests:
            episode = next(
                e
                for e in episodes
                if e.season_number == req_season.season_number and e.episode_number == req_episode.episode_number
            )
            episode.monitored = True
            await update_episode(setting, episode)

    await update_series(setting, series)
