from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.models.users import User
from server.repositories.media import (
    MediaRepository,
    MediaServerEpisodeRepository,
    MediaServerMediaRepository,
    MediaServerSeasonRepository,
)
from server.repositories.requests import MediaRequestRepository
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
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No series found"},
    },
)
def get_series(
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
    series = tmdb.get_tmdb_series(tmdb_id)
    if series is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Series not found.")

    server_ids = [server.server_id for server in current_user.media_servers]
    set_media_db_info(series, current_user.id, server_ids, server_media_repo, request_repo)
    if series.media_servers_info:
        for season in series.seasons:
            set_season_db_info(season, tmdb_id, server_ids, server_season_repo)

    return series.dict(exclude={"requests": {"__all__": {"media"}}})


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
    current_user: User = Depends(deps.get_current_user),
    server_season_repo: MediaServerSeasonRepository = Depends(
        deps.get_repository(MediaServerSeasonRepository)
    ),
    server_episode_repo: MediaServerEpisodeRepository = Depends(
        deps.get_repository(MediaServerEpisodeRepository)
    ),
):
    season = tmdb.get_tmdb_season(tmdb_id, season_number)
    if season is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Season not found.")

    server_ids = [server.server_id for server in current_user.media_servers]
    set_season_db_info(season, tmdb_id, server_ids, server_season_repo)
    if season.media_servers_info:
        for episode in season.episodes:
            set_episode_db_info(episode, tmdb_id, season_number, server_ids, server_episode_repo)

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
    current_user: User = Depends(deps.get_current_user),
    server_episode_repo: MediaServerEpisodeRepository = Depends(
        deps.get_repository(MediaServerEpisodeRepository)
    ),
):
    episode = tmdb.get_tmdb_episode(tmdb_id, season_number, episode_number)
    if episode is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Episode not found.")

    server_ids = [server.server_id for server in current_user.media_servers]
    set_episode_db_info(episode, tmdb_id, season_number, server_ids, server_episode_repo)

    return episode.dict()


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
)
def get_recent_series(
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(deps.get_current_user),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):

    db_recent_series, total_results, total_pages = media_repo.find_all_recently_added(
        media_type=MediaType.series, per_page=per_page, page=page
    )
    server_ids = [server.server_id for server in current_user.media_servers]
    recent_series = []
    for series in db_recent_series:
        tmdb_series = tmdb.get_tmdb_series(series.tmdb_id)
        set_media_db_info(series, current_user.id, server_ids, server_media_repo)
        recent_series.append(tmdb_series.dict())

    return MediaSearchResult(
        page=page, total_pages=total_pages, total_results=total_results, results=recent_series
    )


@router.get("/popular", response_model=MediaSearchResult, response_model_exclude_none=True)
def get_popular_series(
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    popular_series, total_pages, total_results = tmdb.get_tmdb_popular_series(page=page)
    server_ids = [server.server_id for server in current_user.media_servers]
    for series in popular_series:
        set_media_db_info(series, current_user.id, server_ids, server_media_repo)

    search_result = MediaSearchResult(
        results=[m.dict() for m in popular_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/similar", response_model=MediaSearchResult, response_model_exclude_none=True
)
def get_similar_series(
    tmdb_id: int,
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    similar_series, total_pages, total_results = tmdb.get_tmdb_similar_series(
        tmdb_id=tmdb_id, page=page
    )
    server_ids = [server.server_id for server in current_user.media_servers]
    for series in similar_series:
        set_media_db_info(series, current_user.id, server_ids, server_media_repo)

    search_result = MediaSearchResult(
        results=[m.dict() for m in similar_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/recommended",
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
def get_recommended_series(
    tmdb_id: int,
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    recommended_series, total_pages, total_results = tmdb.get_tmdb_recommended_series(
        tmdb_id=tmdb_id, page=page
    )
    server_ids = [server.server_id for server in current_user.media_servers]
    for series in recommended_series:
        set_media_db_info(series, current_user.id, server_ids, server_media_repo)

    search_result = MediaSearchResult(
        results=[m.dict() for m in recommended_series],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result
