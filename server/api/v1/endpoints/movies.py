from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import MediaRepository

router = APIRouter()


@router.get(
    "/{tmdb_id:int}",
    response_model=schemas.Movie,
    response_model_exclude_none=True,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No movie found"},
    },
)
def get_movie(
    tmdb_id: int,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    movie = search.get_tmdb_movie(tmdb_id)
    if movie is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Movie not found.")

    db_media = media_repo.find_by_any_external_id(
        external_ids=[movie.tmdb_id, movie.imdb_id, movie.tvdb_id],
    )
    if db_media is not None:
        movie.plex_media_info = [
            schemas.PlexMediaInfo(**server_media.as_dict())
            for server_media in db_media.server_media
        ]
    return movie.dict()


@router.get(
    "/recent", dependencies=[Depends(deps.get_current_user)], response_model=List[schemas.Movie]
)
def get_recent_movies(
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):

    db_recent_movies = media_repo.find_all_recently_added(media_type=models.MediaType.movies)
    recent_movies = []
    for movie in db_recent_movies:
        tmdb_movie = search.get_tmdb_movie(movie.tmdb_id)
        tmdb_movie.plex_media_info = movie.server_media
        recent_movies.append(tmdb_movie.dict())

    return recent_movies
