from typing import Union, List

from requests import get, post

from server.models import (
    SonarrConfig,
)

from server.core import utils


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
        r = get(url)
    except Exception:
        return False
    if r.status_code != 200:
        return False
    return r.json()


def lookup(
    config: SonarrConfig,
    tvdb_id: int,
):
    url = make_url(
        api_key=config.api_key,
        host=config.host,
        port=config.port,
        ssl=config.ssl,
        resource_path="/series/lookup",
        queries={"term": f"tvdb:{tvdb_id}"},
    )
    lookup_result = get(url).json()[0]
    # return SonarrSeriesSchema().load(lookup_result)


"""
def add_series(config: SonarrConfig, series: SonarrSeries) -> SonarrSeries:
    url = make_url(config, "/series")
    res = post(url, data=SonarrSeriesSchema().dumps(series))
    return SonarrSeriesSchema().load(res.json())


def get_episodes(config: SonarrConfig, series_id: int) -> List[SonarrEpisode]:
    url = make_url(config, "/episode", queries={"seriesId": series_id})
    res = get(url)
    return SonarrEpisodeSchema(many=True).load(res.json())


def send_request(request: SeriesChildRequest):
    config: SonarrConfig = request.selected_provider
    series = lookup(config, request.parent.tvdb_id)
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
        series.add_options = SonarrAddOptions(
            ignore_episodes_with_files=False,
            ignore_episodes_without_files=False,
            search_for_missing_episodes=False,
        )
        series = add_series(config, series)
    episodes = get_episodes(config, series.id)
    # request seasons is empty so we are requesting all the series
    if not request.seasons:
        series.seasons = [set(episode.season_number) for episode in episodes]
        print(series.seasons)
    for season in request.seasons:
        # request episodes are empty so we are requesting all the episodes
        if not season.episodes:
            season.episodes = [
                episode
                for episode in episodes
                if episode.season_number == season.season_number
            ]
        for episode in season.episodes:
            print(episodes)
"""
