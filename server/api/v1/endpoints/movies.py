from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.models.users import User
from server.repositories.media import MediaRepository, MediaServerMediaRepository
from server.repositories.requests import MediaRequestRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import MediaSearchResult, MovieSchema
from server.services import tmdb
from server.services.core import set_media_db_info

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=MovieSchema,
    response_model_exclude_none=True,
    response_model_exclude={"requests": {"__all__": {"media"}}},
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No movie found"},
    },
)
async def get_movie(
    tmdb_id: int,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
    request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
):
    movie = await tmdb.get_tmdb_movie(tmdb_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")
    server_ids = [server.server_id for server in current_user.media_servers]
    await set_media_db_info(movie, current_user.id, server_ids, server_media_repo, request_repo)

    return movie


@router.get(
    "/recent", dependencies=[Depends(deps.get_current_user)], response_model=MediaSearchResult
)
async def get_recently_added_movies(
    page: int = 1,
    per_page: int = 10,
    current_user: User = Depends(deps.get_current_user),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    server_ids = [server.server_id for server in current_user.media_servers]
    db_recent_movies, total_results, total_pages = await media_repo.find_all_recently_added(
        media_type=MediaType.movie, server_ids=server_ids, page=page, per_page=per_page
    )
    recent_movies = []
    for movie in db_recent_movies:
        tmdb_movie = await tmdb.get_tmdb_movie(movie.tmdb_id)
        tmdb_movie.media_servers_info = [
            PlexMediaInfo(**m.as_dict()) for m in movie.server_media if m.server_id in server_ids
        ]
        recent_movies.append(tmdb_movie)

    return MediaSearchResult(
        page=page, total_pages=total_pages, total_results=total_results, results=recent_movies
    )


@router.get("/popular", response_model=MediaSearchResult, response_model_exclude_none=True)
async def get_popular_movies(
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    popular_movies, total_pages, total_results = await tmdb.get_tmdb_popular_movies(page=page)
    server_ids = [server.server_id for server in current_user.media_servers]
    for movie in popular_movies:
        await set_media_db_info(movie, current_user.id, server_ids, server_media_repo)

    return MediaSearchResult(
        results=popular_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get("/upcoming", response_model=MediaSearchResult, response_model_exclude_none=True)
async def get_upcoming_movies(
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    upcoming_movies, total_pages, total_results = await tmdb.get_tmdb_upcoming_movies(page=page)
    server_ids = [server.server_id for server in current_user.media_servers]
    for movie in upcoming_movies:
        await set_media_db_info(movie, current_user.id, server_ids, server_media_repo)

    return MediaSearchResult(
        results=upcoming_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/{tmdb_id:int}/similar", response_model=MediaSearchResult, response_model_exclude_none=True
)
async def get_similar_movies(
    tmdb_id: int,
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    similar_movies, total_pages, total_results = await tmdb.get_tmdb_similar_movies(
        tmdb_id=tmdb_id, page=page
    )
    server_ids = [server.server_id for server in current_user.media_servers]
    for movie in similar_movies:
        await set_media_db_info(movie, current_user.id, server_ids, server_media_repo)

    return MediaSearchResult(
        results=similar_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/{tmdb_id:int}/recommended",
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_recommended_movies(
    tmdb_id: int,
    page: int = 1,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    recommended_movies, total_pages, total_results = await tmdb.get_tmdb_recommended_movies(
        tmdb_id=tmdb_id, page=page
    )
    server_ids = [server.server_id for server in current_user.media_servers]
    for movie in recommended_movies:
        await set_media_db_info(movie, current_user.id, server_ids, server_media_repo)

    return MediaSearchResult(
        results=recommended_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
