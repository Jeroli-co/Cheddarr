from typing import Optional

from fastapi import APIRouter, Depends

from server.api import dependencies as deps
from server.models.media import MediaType
from server.repositories.media import MediaRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.search import SearchResult
from server.services import tmdb

router = APIRouter()


@router.get("", response_model=SearchResult, response_model_exclude_none=True)
def search_media(
    value: str,
    page: int = 1,
    media_type: Optional[MediaType] = None,
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
):
    if media_type == MediaType.series:
        media_results, total_pages, total_results = tmdb.search_tmdb_series(value, page)
    elif media_type == MediaType.movies:
        media_results, total_pages, total_results = tmdb.search_tmdb_movies(value, page)
    else:
        media_results, total_pages, total_results = tmdb.search_tmdb_media(value, page)

    for media in media_results:
        db_media = media_repo.find_by_any_external_id(
            external_ids=[media.tmdb_id, media.imdb_id, media.tvdb_id],
        )
        if db_media is not None:
            media.plex_media_info = [
                PlexMediaInfo(**server_media.as_dict()) for server_media in db_media.server_media
            ]
    search_result = SearchResult(
        results=[m.dict() for m in media_results],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
    return search_result
