from fastapi import APIRouter, Depends, HTTPException, status

from server import schemas
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import MediaRepository

router = APIRouter()


@router.get(
    "/movies/{tmdb_id}",
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


@router.get("/movies/recent")
def get_recent_movies():
    pass
