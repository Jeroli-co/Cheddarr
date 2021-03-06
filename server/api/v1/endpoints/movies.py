from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.repositories.media import MediaRepository
from server.repositories.requests import MediaRequestRepository
from server.schemas.media import MovieSchema
from server.schemas.search import SearchResult
from server.services import tmdb
from server.services.core import set_media_db_info

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=MovieSchema,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No movie found"},
    },
)
def get_movie(
    tmdb_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
):
    movie = tmdb.get_tmdb_movie(tmdb_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")
    set_media_db_info(movie, media_repo, request_repo)
    return movie.dict()


@router.get(
    "/recent", dependencies=[Depends(deps.get_current_user)], response_model=List[MovieSchema]
)
def get_recent_movies(
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):

    db_recent_movies = media_repo.find_all_recently_added(media_type=MediaType.movies)
    recent_movies = []
    for movie in db_recent_movies:
        tmdb_movie = tmdb.get_tmdb_movie(movie.tmdb_id)
        tmdb_movie.plex_media_info = movie.server_media
        recent_movies.append(tmdb_movie.dict())

    return recent_movies


@router.get("/popular", response_model=SearchResult, response_model_exclude_none=True)
def get_popular_movies(
    page: int = 1, media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository))
):
    popular_movies, total_pages, total_results = tmdb.get_tmdb_popular_movies(page=page)
    for movie in popular_movies:
        set_media_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in popular_movies],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get("/upcoming", response_model=SearchResult, response_model_exclude_none=True)
def get_upcoming_movies(
    page: int = 1, media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository))
):
    upcoming_movies, total_pages, total_results = tmdb.get_tmdb_upcoming_movies(page=page)
    for movie in upcoming_movies:
        set_media_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in upcoming_movies],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/similar", response_model=SearchResult, response_model_exclude_none=True
)
def get_similar_movies(
    tmdb_id: int,
    page: int = 1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    similar_movies, total_pages, total_results = tmdb.get_tmdb_similar_movies(
        tmdb_id=tmdb_id, page=page
    )
    for movie in similar_movies:
        set_media_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in similar_movies],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result


@router.get(
    "/{tmdb_id:int}/recommended", response_model=SearchResult, response_model_exclude_none=True
)
def get_recommended_movies(
    tmdb_id: int,
    page: int = 1,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    recommended_movies, total_pages, total_results = tmdb.get_tmdb_recommended_movies(
        tmdb_id=tmdb_id, page=page
    )
    for movie in recommended_movies:
        set_media_db_info(movie, media_repo)

    search_result = SearchResult(
        results=[m.dict() for m in recommended_movies],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )

    return search_result
