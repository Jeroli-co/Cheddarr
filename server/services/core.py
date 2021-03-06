from typing import List

from pydantic import parse_obj_as

from server.models.requests import EpisodeRequest, SeasonRequest, SeriesRequest
from server.repositories.media import EpisodeRepository, MediaRepository, SeasonRepository
from server.repositories.requests import MediaRequestRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import (
    EpisodeSchema,
    MediaSchema,
    SeasonSchema,
    SeriesSchema,
)
from server.schemas.requests import MovieRequestSchema, SeriesRequestCreate


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


def set_media_db_info(
    media: MediaSchema, current_user_id:int,media_repo: MediaRepository, request_repo: MediaRequestRepository = None
):
    db_media = media_repo.find_by_external_id(
        external_ids=[media.tmdb_id, media.imdb_id, media.tvdb_id],
    )
    if db_media is not None:
        media.media_server_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_media.server_media
        ]

        if request_repo is not None:
            media.requests = parse_obj_as(
                List[MovieRequestSchema], request_repo.find_all_by_user_ids_and_tmdb_id(requesting_user_id=current_user_id,tmdb_id=media.tmdb_id)
            )


def set_season_db_info(season: SeasonSchema, series_tmdb_id: int, season_repo: SeasonRepository):
    db_season = season_repo.find_by_external_id_and_season_number(
        external_ids=[series_tmdb_id],
        season_number=season.season_number,
    )
    if db_season is not None:
        season.media_server_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_season.server_seasons
        ]


def set_episode_db_info(
    episode: EpisodeSchema, series_tmdb_id: int, season_number, episode_repo: EpisodeRepository
):

    db_episode = episode_repo.find_by_external_id_and_season_number_and_episode_number(
        external_ids=[series_tmdb_id],
        season_number=season_number,
        episode_number=episode.episode_number,
    )
    if db_episode is not None:
        episode.plex_media_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_episode.server_episodes
        ]


def set_seasons_db_info(series: SeriesSchema, season_repo: SeasonRepository):
    db_seasons = season_repo.find_all_by(series_id=series.tmdb_id)
    for season in series.seasons:
        season_info = next(
            (s for s in db_seasons if s.season_number == season.season_number), None
        )
        if season_info is not None:
            season.plex_media_info = [
                PlexMediaInfo(**s.as_dict()) for s in season_info.server_seasons
            ]


def set_episodes_db_info(
    season: SeasonSchema,
    series_tmdb_id,
    episode_repo: EpisodeRepository,
):
    db_episodes = episode_repo.find_all_by_external_id_and_season_number(
        external_ids=[series_tmdb_id], season_number=season.season_number
    )
    for episode in season.episodes:
        episode_info = next(
            (e for e in db_episodes if e.episode_number == episode.episode_number), None
        )
        if episode_info is not None:
            episode.plex_media_info = [
                PlexMediaInfo(**s.as_dict()) for s in episode_info.server_episodes
            ]
