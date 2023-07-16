from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from server.api import dependencies as deps
from server.api.dependencies import CurrentUser
from server.models.media import MediaType
from server.schemas.base import PaginatedResponse
from server.schemas.media import EpisodeSchema, SeasonSchema, SeriesSchema
from server.services import tmdb
from server.services.media import MediaService

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model_exclude={"requests": {"__all__": {"media"}}},
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
async def get_series(
    tmdb_id: int,
    *,
    current_user: CurrentUser,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> SeriesSchema:
    series = await tmdb.get_tmdb_series(tmdb_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    await media_service.set_media_db_info(series, current_user.id)
    if series.media_servers_info and series.seasons:
        for season in series.seasons:
            await media_service.set_season_db_info(season, tmdb_id=tmdb_id)

    return series


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}",
    dependencies=[Depends(deps.get_current_user)],
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
async def get_season(
    tmdb_id: int,
    season_number: int,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> SeasonSchema:
    season = await tmdb.get_tmdb_season(tmdb_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    await media_service.set_season_db_info(season, tmdb_id=tmdb_id)
    if season.media_servers_info and season.episodes:
        for episode in season.episodes:
            await media_service.set_episode_db_info(episode, tmdb_id, season_number)

    return season


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}/episodes/{episode_number}",
    dependencies=[Depends(deps.get_current_user)],
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
async def get_episode(
    tmdb_id: int,
    season_number: int,
    episode_number: int,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> EpisodeSchema:
    episode = await tmdb.get_tmdb_episode(tmdb_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    await media_service.set_episode_db_info(episode, tmdb_id, season_number)

    return episode


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=PaginatedResponse[SeriesSchema],
    response_model_exclude_none=True,
)
async def get_recently_added_series(
    page: int = 1,
    per_page: int = 10,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> PaginatedResponse[Any]:
    return await media_service.get_recently_added_media(MediaType.series, page, per_page)


@router.get(
    "/popular",
    dependencies=[Depends(deps.get_current_user)],
    response_model_exclude_none=True,
)
async def get_popular_series(
    page: int = 1,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> PaginatedResponse[SeriesSchema]:
    popular_series = await tmdb.get_tmdb_popular_series(page=page)
    for series in popular_series.results:
        await media_service.set_media_db_info(series)

    return popular_series


@router.get(
    "/{tmdb_id:int}/similar",
    dependencies=[Depends(deps.get_current_user)],
    response_model_exclude_none=True,
)
async def get_similar_series(
    tmdb_id: int,
    page: int = 1,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> PaginatedResponse[SeriesSchema]:
    similar_series = await tmdb.get_tmdb_similar_series(tmdb_id=tmdb_id, page=page)
    for series in similar_series.results:
        await media_service.set_media_db_info(series)

    return similar_series


@router.get(
    "/{tmdb_id:int}/recommended",
    dependencies=[Depends(deps.get_current_user)],
    response_model_exclude_none=True,
)
async def get_recommended_series(
    tmdb_id: int,
    page: int = 1,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> PaginatedResponse[SeriesSchema]:
    recommended_series = await tmdb.get_tmdb_recommended_series(tmdb_id=tmdb_id, page=page)
    for series in recommended_series.results:
        await media_service.set_media_db_info(series)

    return recommended_series


@router.get(
    "/discover",
    dependencies=[Depends(deps.get_current_user)],
    response_model_exclude_none=True,
)
async def get_series_discover(
    genre_id: int | None = None,
    page: int = 1,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> PaginatedResponse[SeriesSchema]:
    series_discover = await tmdb.get_tmdb_series_discover(
        genre_id=genre_id,
        page=page,
    )

    for series in series_discover.results:
        await media_service.set_media_db_info(series)

    return series_discover
