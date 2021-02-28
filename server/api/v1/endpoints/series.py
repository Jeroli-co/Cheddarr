from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from server import schemas
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import EpisodeRepository, MediaRepository, SeasonRepository

router = APIRouter()


@router.get(
    "/series/{tmdb_id}",
    response_model=schemas.Series,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def get_series(
    tmdb_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    season_repo: SeasonRepository = Depends(deps.get_repository(SeasonRepository)),
):
    series = search.get_tmdb_series(tmdb_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    db_media = media_repo.find_by_any_external_id(
        external_ids=[series.tmdb_id, series.imdb_id, series.tvdb_id],
    )
    if db_media is not None:
        series.plex_media_info = [
            schemas.PlexMediaInfo(**media_info.as_dict()) for media_info in db_media.server_media
        ]
        db_seasons = season_repo.find_all_by(series_id=db_media.id)
        if db_seasons is not None:
            for season in series.seasons:
                season_info = next(
                    (s for s in db_seasons if s.season_number == season.season_number), None
                )
                if season_info is not None:
                    season.plex_media_info = [
                        schemas.PlexMediaInfo(**s.as_dict()) for s in season_info.server_season
                    ]

        return series.dict()


@router.get(
    "/series/{tmdb_id}/seasons/{season_number}",
    response_model=schemas.Season,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
def get_season(
    tmdb_id: int,
    season_number: int,
    season_repo: SeasonRepository = Depends(deps.get_repository(SeasonRepository)),
    episode_repo: EpisodeRepository = Depends(deps.get_repository(EpisodeRepository)),
):
    season = search.get_tmdb_season(tmdb_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    db_season = season_repo.find_by_any_external_id_and_season_number(
        external_ids=[tmdb_id],
        season_number=season.season_number,
    )
    if db_season is not None:
        season.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in db_season.server_season
        ]
    db_episodes = episode_repo.find_all_by(season_id=db_season.id)
    if db_episodes is not None:
        for episode in season.episodes:
            episode_info = next(
                (e for e in db_episodes if e.episode_number == episode.episode_number), None
            )
            if episode_info is not None:
                episode.plex_media_info = [
                    schemas.PlexMediaInfo(**s.as_dict()) for s in episode_info.server_episode
                ]
    return season.dict()


@router.get(
    "/series/{tmdb_id}/seasons/{season_number}/episodes/{episode_number}",
    response_model=schemas.Episode,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
def get_episode(
    tmdb_id: int,
    season_number: int,
    episode_number: int,
    episode_repo: EpisodeRepository = Depends(deps.get_repository(EpisodeRepository)),
):
    episode = search.get_tmdb_episode(tmdb_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    db_episode = episode_repo.find_by_any_external_id_and_season_number_and_episode_number(
        external_ids=[tmdb_id],
        season_number=season_number,
        episode_number=episode_number,
    )
    if db_episode is not None:
        episode.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in db_episode.server_episode
        ]
    return episode.dict()
