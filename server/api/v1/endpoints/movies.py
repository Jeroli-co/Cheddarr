from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.models.users import User
from server.repositories.media import MediaServerMediaRepository
from server.repositories.requests import MediaRequestRepository
from server.schemas.media import MediaSearchResult, MovieSchema
from server.services import tmdb
from server.services.core import set_media_db_info
from server.services.plex import PlexMediaInfo

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=MovieSchema,
    response_model_exclude={"requests": {"__all__": {"media"}}},
    response_model_exclude_none=True,
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
    await set_media_db_info(movie, server_media_repo, current_user.id, request_repo)

    return movie


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_recently_added_movies(
    page: int = 1,
    per_page: int = 10,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    (
        servers_recent_movies,
        total_results,
        total_pages,
    ) = await server_media_repo.find_all_recently_added(
        media_type=MediaType.movie, page=page, per_page=per_page
    )
    recent_movies = []
    for server_movie in servers_recent_movies:
        movie = MovieSchema.from_orm(server_movie.media)
        movie.media_servers_info = [PlexMediaInfo(**server_movie.as_dict())]
        recent_movies.append(movie)

    return MediaSearchResult(
        page=page, total_pages=total_pages, total_results=total_results, results=recent_movies
    )


@router.get(
    "/popular",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_popular_movies(
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    popular_movies, total_pages, total_results = await tmdb.get_tmdb_popular_movies(page=page)
    for movie in popular_movies:
        await set_media_db_info(movie, server_media_repo)

    return MediaSearchResult(
        results=popular_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/upcoming",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_upcoming_movies(
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    upcoming_movies, total_pages, total_results = await tmdb.get_tmdb_upcoming_movies(page=page)
    for movie in upcoming_movies:
        await set_media_db_info(movie, server_media_repo)

    return MediaSearchResult(
        results=upcoming_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/{tmdb_id:int}/similar",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_similar_movies(
    tmdb_id: int,
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    similar_movies, total_pages, total_results = await tmdb.get_tmdb_similar_movies(
        tmdb_id=tmdb_id, page=page
    )
    for movie in similar_movies:
        await set_media_db_info(movie, server_media_repo)

    return MediaSearchResult(
        results=similar_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/{tmdb_id:int}/recommended",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_recommended_movies(
    tmdb_id: int,
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    recommended_movies, total_pages, total_results = await tmdb.get_tmdb_recommended_movies(
        tmdb_id=tmdb_id, page=page
    )
    for movie in recommended_movies:
        await set_media_db_info(movie, server_media_repo)

    return MediaSearchResult(
        results=recommended_movies,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )


@router.get(
    "/discover",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
)
async def get_movies_discover(
    genre_id: Optional[int] = None,
    page: int = 1,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    movies_discover, total_pages, total_results = await tmdb.get_tmdb_movies_discover(
        genre_id=genre_id, page=page
    )
    for movie in movies_discover:
        await set_media_db_info(movie, server_media_repo)

    return MediaSearchResult(
        results=movies_discover,
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
