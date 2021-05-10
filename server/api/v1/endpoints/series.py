from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.models.users import User
from server.repositories.media import (
    MediaServerEpisodeRepository,
    MediaServerMediaRepository,
    MediaServerSeasonRepository,
)
from server.repositories.requests import MediaRequestRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import EpisodeSchema, MediaSearchResult, SeasonSchema, SeriesSchema
from server.services import tmdb
from server.services.core import (
    set_episode_db_info,
    set_media_db_info,
    set_season_db_info,
)

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=SeriesSchema,
    response_model_exclude_unset=True,
    response_model_exclude={"requests": {"__all__": {"media"}}},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
async def get_series(
    tmdb_id: int,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
    server_season_repo: MediaServerSeasonRepository = Depends(
        deps.get_repository(MediaServerSeasonRepository)
    ),
    request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
):
    series = await tmdb.get_tmdb_series(tmdb_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    await set_media_db_info(series, server_media_repo, current_user.id, request_repo)
    if series.media_servers_info:
        for season in series.seasons:
            await set_season_db_info(season, tmdb_id, server_season_repo)

    return series


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}",
    dependencies=[Depends(deps.get_current_user)],
    response_model=SeasonSchema,
    response_model_exclude_unset=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No season found"},
    },
)
async def get_season(
    tmdb_id: int,
    season_number: int,
    server_season_repo: MediaServerSeasonRepository = Depends(
        deps.get_repository(MediaServerSeasonRepository)
    ),
    server_episode_repo: MediaServerEpisodeRepository = Depends(
        deps.get_repository(MediaServerEpisodeRepository)
    ),
):
    season = await tmdb.get_tmdb_season(tmdb_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    await set_season_db_info(season, tmdb_id, server_season_repo)
    if season.media_servers_info:
        for episode in season.episodes:
            await set_episode_db_info(episode, tmdb_id, season_number, server_episode_repo)

    return season


@router.get(
    "/{tmdb_id:int}/seasons/{season_number}/episodes/{episode_number}",
    dependencies=[Depends(deps.get_current_user)],
    response_model=EpisodeSchema,
    response_model_exclude_unset=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No episode found"},
    },
)
async def get_episode(
    tmdb_id: int,
    season_number: int,
    episode_number: int,
    server_episode_repo: MediaServerEpisodeRepository = Depends(
        deps.get_repository(MediaServerEpisodeRepository)
    ),
):
    episode = await tmdb.get_tmdb_episode(tmdb_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    await set_episode_db_info(episode, tmdb_id, season_number, server_episode_repo)

    return episode


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_unset=True,
)
async def get_recently_added_series(
    page: int = 1,
    per_page: int = 10,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    (
        servers_recent_series,
        total_results,
        total_pages,
    ) = await server_media_repo.find_all_recently_added(
        media_type=MediaType.series, per_page=per_page, page=page
    )
    recent_series = []
    for server_series in servers_recent_series:
        series = server_series.media
        series.media_servers_info = [PlexMediaInfo(**server_series.as_dict())]
        recent_series.append(series)

    return MediaSearchResult(
        page=page, total_pages=total_pages, total_results=total_results, results=recent_series
    )


@router.get(
    "/popular",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_unset=True,
)
async def get_popular_series(
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    popular_series, total_pages, total_results = await tmdb.get_tmdb_popular_series(page=page)
    for series in popular_series:
        await set_media_db_info(series, server_media_repo)

    return MediaSearchResult(
        results=popular_series,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/{tmdb_id:int}/similar",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_unset=True,
)
async def get_similar_series(
    tmdb_id: int,
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    similar_series, total_pages, total_results = await tmdb.get_tmdb_similar_series(
        tmdb_id=tmdb_id, page=page
    )
    for series in similar_series:
        await set_media_db_info(series, server_media_repo)

    return MediaSearchResult(
        results=similar_series,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/{tmdb_id:int}/recommended",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_unset=True,
)
async def get_recommended_series(
    tmdb_id: int,
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    recommended_series, total_pages, total_results = await tmdb.get_tmdb_recommended_series(
        tmdb_id=tmdb_id, page=page
    )
    for series in recommended_series:
        await set_media_db_info(series, server_media_repo)

    return MediaSearchResult(
        results=recommended_series,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
