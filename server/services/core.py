from typing import List

from pydantic import parse_obj_as

from server.repositories.media import MediaRepository
from server.repositories.requests import MediaRequestRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import MovieSchema
from server.schemas.requests import MovieRequestSchema


def set_movie_db_info(
    movie: MovieSchema, media_repo: MediaRepository, request_repo: MediaRequestRepository = None
):
    db_media = media_repo.find_by_any_external_id(
        external_ids=[movie.tmdb_id, movie.imdb_id, movie.tvdb_id],
    )
    if db_media is not None:
        movie.plex_media_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_media.server_media
        ]

        if request_repo is not None:
            movie.requests = parse_obj_as(
                List[MovieRequestSchema], request_repo.find_all_by_tmdb_id(tmdb_id=movie.tmdb_id)
            )
