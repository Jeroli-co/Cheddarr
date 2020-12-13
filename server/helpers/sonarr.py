from typing import Union

import requests
from pydantic.tools import parse_obj_as

from server import schemas
from server.core import utils
from server.models import (
    SeriesRequest,
    SeriesType,
    SonarrConfig,
)


def make_url(
    *,
    api_key: str,
    host: str,
    port: int,
    ssl: bool,
    version: int = None,
    resource_path: str,
    queries: dict = None,
) -> str:
    queries = queries or {}
    port = port
    version = version
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


def check_instance_status(
    api_key: str, host: str, port: int, ssl: bool
) -> Union[bool, dict]:
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


def lookup(
    config: SonarrConfig,
    tvdb_id: int,
) -> schemas.SonarrSeries:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path="/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    lookup_result = requests.get(url).json()[0]
    return schemas.SonarrSeries.parse_obj(lookup_result)


def get_series(config: SonarrConfig, series_id: int) -> schemas.SonarrSeries:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path=f"/series/{series_id}",
    )
    res = requests.get(url)
    return schemas.SonarrSeries.parse_obj(res.json())


def add_series(
    config: SonarrConfig, series: schemas.SonarrSeries
) -> schemas.SonarrSeries:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path="/series",
    )
    res = requests.post(url, data=series.json(by_alias=True, exclude_none=True))
    return schemas.SonarrSeries.parse_obj(res.json())


def update_series(
    config: SonarrConfig, series: schemas.SonarrSeries
) -> schemas.SonarrSeries:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path="/series",
    )
    res = requests.put(url, data=series.json(by_alias=True, exclude_none=True))
    return schemas.SonarrSeries.parse_obj(res.json())


def get_episodes(config: SonarrConfig, series_id: int) -> list[schemas.SonarrEpisode]:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path="/episode",
        queries={"seriesId": series_id},
    )
    res = requests.get(url)
    return parse_obj_as(list[schemas.SonarrEpisode], res.json())


def update_episode(
    config: schemas.SonarrConfig, series_id: int, episode: schemas.SonarrEpisode
) -> schemas.SonarrEpisode:
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        version=config.version,
        resource_path=f"/episode/{episode.id}",
    )
    res = requests.put(url, data=episode.json(by_alias=True, exclude_none=True))
    print(res.json())
    return schemas.SonarrEpisode.parse_obj(res.json())


def send_request(request: SeriesRequest):
    config: SonarrConfig = request.selected_provider
    series = lookup(config, request.series.tvdb_id)
    if series.id is None:  # series is not added to sonarr yet.
        root_folder_path = config.root_folder
        quality_profile_id = config.quality_profile_id
        language_profile_id = config.language_profile_id
        if series.series_type == SeriesType.anime:
            series.root_folder_path = config.anime_root_folder or root_folder_path
            series.quality_profile_id = (
                config.anime_quality_profile_id or quality_profile_id
            )
            series.language_profile_id = (
                config.anime_language_profile_id or language_profile_id
            )
        series.root_folder_path = root_folder_path
        series.quality_profile_id = quality_profile_id
        if config.version == 3:
            series.language_profile_id = language_profile_id
        series.add_options = schemas.SonarrAddOptions(
            ignore_episodes_with_files=False,
            ignore_episodes_without_files=False,
            search_for_missing_episodes=False,
        )
        series = add_series(config, series)
    else:
        series = get_series(config, series.id)
    # request seasons is empty so we are requesting all the series
    if not request.seasons:
        for season in series.seasons:
            season.monitored = True
        update_series(config, series)
    else:
        episodes = get_episodes(config, series.id)
        for req_season in request.seasons:
            season = next(
                s for s in series.seasons if s.season_number == req_season.season_number
            )
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
                update_episode(config, series.id, episode)
        print(series)
        update_series(config, series)
