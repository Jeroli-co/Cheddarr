from typing import List, Union

from pydantic import parse_obj_as

from server.models.requests import EpisodeRequest, MovieRequest, SeasonRequest, SeriesRequest
from server.models.settings import MediaProviderSetting, RadarrSetting, SonarrSetting
from server.repositories.media import (
    MediaServerEpisodeRepository,
    MediaServerMediaRepository,
    MediaServerSeasonRepository,
)
from server.repositories.requests import MediaRequestRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import (
    EpisodeSchema,
    MediaSchema,
    SeasonSchema,
)
from server.schemas.requests import MovieRequestSchema, SeriesRequestCreate, SeriesRequestSchema
from server.services import radarr, sonarr


def unify_series_request(series_request: SeriesRequest, request_in: SeriesRequestCreate):
    if request_in.seasons is None:
        request_in.seasons = []
    for season in request_in.seasons:
        if season.episodes is None:
            season.episodes = []
        else:
            episodes = []
            for episode in season.episodes:
                episodes.append(episode.to_orm(EpisodeRequest))
            season.episodes = episodes

        already_added_season = next(
            (s for s in series_request.seasons if s.season_number == season.season_number),
            None,
        )

        if not already_added_season:
            series_request.seasons.append(season.to_orm(SeasonRequest))
        else:
            if season.episodes:
                already_added_season.episodes.extend(season.episodes)
            else:
                already_added_season.episodes = season.episodes


async def send_series_request(request: SeriesRequest, provider: MediaProviderSetting):
    if isinstance(provider, SonarrSetting):
        await sonarr.send_request(request)


async def send_movie_request(request: MovieRequest, provider: MediaProviderSetting):
    if isinstance(provider, RadarrSetting):
        await radarr.send_request(request)


async def set_media_db_info(
    media: MediaSchema,
    current_user_id: int,
    current_user_server_ids: List[str],
    server_media_repo: MediaServerMediaRepository,
    request_repo: MediaRequestRepository = None,
):
    db_media = await server_media_repo.find_by_external_id_and_server_ids(
        tmdb_id=media.tmdb_id,
        imdb_id=media.imdb_id,
        tvdb_id=media.tvdb_id,
        server_ids=current_user_server_ids,
    )
    media.media_servers_info = [
        PlexMediaInfo(**server_media.as_dict()) for server_media in db_media
    ]

    if request_repo is not None:
        media.requests = parse_obj_as(
            List[Union[SeriesRequestSchema, MovieRequestSchema]],
            await request_repo.find_all_by_tmdb_id(
                requesting_user_id=current_user_id, tmdb_id=media.tmdb_id
            ),
        )


async def set_season_db_info(
    season: SeasonSchema,
    series_tmdb_id: int,
    current_user_server_ids: List[str],
    server_season_repo: MediaServerSeasonRepository,
):
    db_seasons = await server_season_repo.find_by_external_id_and_season_number_and_server_ids(
        tmdb_id=series_tmdb_id,
        season_number=season.season_number,
        server_ids=current_user_server_ids,
    )
    season.media_servers_info = [
        PlexMediaInfo(**server_media.as_dict()) for server_media in db_seasons
    ]


async def set_episode_db_info(
    episode: EpisodeSchema,
    series_tmdb_id: int,
    season_number,
    current_user_server_ids: List[str],
    episode_repo: MediaServerEpisodeRepository,
):

    db_episode = (
        await episode_repo.find_by_external_id_and_season_number_and_episode_number_and_server_ids(
            tmdb_id=series_tmdb_id,
            season_number=season_number,
            episode_number=episode.episode_number,
            server_ids=current_user_server_ids,
        )
    )
    if db_episode is not None:
        episode.media_servers_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_episode
        ]
