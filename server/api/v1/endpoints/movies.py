from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.models.media import MediaType
from server.models.users import User
from server.schemas.media import MediaSearchResponse, MovieSchema
from server.services import tmdb
from server.services.media import MediaService

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
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MovieSchema:
    movie = await tmdb.get_tmdb_movie(tmdb_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")

    await media_service.set_media_db_info(movie, current_user.id)

    return movie


@router.get(
    "/recent",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResponse,
    response_model_exclude_none=True,
)
async def get_recently_added_movies(
    page: int = 1,
    per_page: int = 10,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MediaSearchResponse:
    return await media_service.get_recently_added_media(MediaType.movie, page, per_page)


@router.get(
    "/popular",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResponse,
    response_model_exclude_none=True,
)
async def get_popular_movies(
    page: int = 1,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MediaSearchResponse:
    popular_movies = await tmdb.get_tmdb_popular_movies(page=page)
    for movie in popular_movies.items:
        await media_service.set_media_db_info(movie)

    return popular_movies


@router.get(
    "/upcoming",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResponse,
    response_model_exclude_none=True,
)
async def get_upcoming_movies(
    page: int = 1,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MediaSearchResponse:
    upcoming_movies = await tmdb.get_tmdb_upcoming_movies(page=page)
    for movie in upcoming_movies.items:
        await media_service.set_media_db_info(movie)

    return upcoming_movies


@router.get(
    "/{tmdb_id:int}/similar",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResponse,
    response_model_exclude_none=True,
)
async def get_similar_movies(
    tmdb_id: int,
    page: int = 1,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MediaSearchResponse:
    similar_movies = await tmdb.get_tmdb_similar_movies(tmdb_id=tmdb_id, page=page)
    for movie in similar_movies.items:
        await media_service.set_media_db_info(movie)

    return similar_movies


@router.get(
    "/{tmdb_id:int}/recommended",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResponse,
    response_model_exclude_none=True,
)
async def get_recommended_movies(
    tmdb_id: int,
    page: int = 1,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MediaSearchResponse:
    recommended_movies = await tmdb.get_tmdb_recommended_movies(tmdb_id=tmdb_id, page=page)
    for movie in recommended_movies.items:
        await media_service.set_media_db_info(movie)

    return recommended_movies


@router.get(
    "/discover",
    dependencies=[Depends(deps.get_current_user)],
    response_model=MediaSearchResponse,
    response_model_exclude_none=True,
)
async def get_movies_discover(
    genre_id: int | None = None,
    page: int = 1,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MediaSearchResponse:
    movies_discover = await tmdb.get_tmdb_movies_discover(
        genre_id=genre_id,
        page=page,
    )
    for movie in movies_discover.items:
        await media_service.set_media_db_info(movie)

    return movies_discover
