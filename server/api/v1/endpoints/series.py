from typing import List

from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.repositories.media import (
    EpisodeRepository,
    MediaRepository,
    SeasonRepository,
)
from server.repositories.requests import MediaRequestRepository
from server.schemas.media import EpisodeSchema, SeasonSchema, SeriesSchema
from server.schemas.search import SearchResult
from server.services import tmdb
from server.services.core import (
    set_episode_db_info,
    set_episodes_db_info,
    set_media_db_info,
    set_season_db_info,
    set_seasons_db_info,
)

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=SeriesSchema,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def get_series(
    tmdb_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    season_repo: SeasonRepository = Depends(deps.get_repository(SeasonRepository)),
    request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
):
    series = tmdb.get_tmdb_series(tmdb_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    set_media_db_info(series, media_repo, request_repo)
    if series.media_server_info is not None:
        set_seasons_db_info(series, season_repo)

    return series.dict()


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}",
    response_model=SeasonSchema,
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
    season = tmdb.get_tmdb_season(tmdb_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    set_season_db_info(season, tmdb_id, season_repo)
    set_episodes_db_info(season, tmdb_id, episode_repo)

    return season.dict()


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}/episodes/{episode_number}",
    response_model=EpisodeSchema,
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
    episode = tmdb.get_tmdb_episode(tmdb_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    set_episode_db_info(episode, tmdb_id, season_number, episode_repo)

    return episode.dict()


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=List[SeriesSchema],
)
def get_recent_series(
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):

    db_recent_series = media_repo.find_all_recently_added(media_type=MediaType.series)
    recent_series = []
    for series in db_recent_series:
        tmdb_series = tmdb.get_tmdb_series(series.tmdb_id)
        tmdb_series.plex_media_info = series.server_media
        recent_series.append(tmdb_series.dict())

    return recent_series


@router.get("/popular", response_model=SearchResult, response_model_exclude_none=True)
def get_popular_series(
    page: int = 1, media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository))
):
    popular_series, total_pages, total_results = tmdb.get_tmdb_popular_series(page=page)
    for series in popular_series:
        set_media_db_info(series, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in popular_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get("/upcoming", response_model=SearchResult, response_model_exclude_none=True)
def get_upcoming_series(
    page: int = 1, media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository))
):
    upcoming_series, total_pages, total_results = tmdb.get_tmdb_upcoming_series(page=page)
    for series in upcoming_series:
        set_media_db_info(series, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in upcoming_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/similar", response_model=SearchResult, response_model_exclude_none=True
)
def get_similar_series(
    tmdb_id: int,
    page: int = 1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    similar_series, total_pages, total_results = tmdb.get_tmdb_similar_series(
        tmdb_id=tmdb_id, page=page
    )
    for series in similar_series:
        set_media_db_info(series, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in similar_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/recommended", response_model=SearchResult, response_model_exclude_none=True
)
def get_recommended_series(
    tmdb_id: int,
    page: int = 1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    recommended_series, total_pages, total_results = tmdb.get_tmdb_recommended_series(
        tmdb_id=tmdb_id, page=page
    )
    for series in recommended_series:
        set_media_db_info(series, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in recommended_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result
