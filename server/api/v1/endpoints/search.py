from typing import Optional

from fastapi import APIRouter, Depends

from server.api import dependencies as deps
from server.models.media import MediaType
from server.models.users import User
from server.repositories.media import MediaServerMediaRepository
from server.schemas.external_services import PlexMediaInfo
from server.schemas.media import MediaSearchResult
from server.services import tmdb

router = APIRouter()


@router.get(
    "",
    response_model=MediaSearchResult,
    response_model_exclude_none=True,
    dependencies=[Depends(deps.get_current_user)],
)
def search_media(
    value: str,
    page: int = 1,
    media_type: Optional[MediaType] = None,
    current_user: User = Depends(deps.get_current_user),
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    if media_type == MediaType.series:
        media_results, total_pages, total_results = tmdb.search_tmdb_series(value, page)
    elif media_type == MediaType.movie:
        media_results, total_pages, total_results = tmdb.search_tmdb_movies(value, page)
    else:
        media_results, total_pages, total_results = tmdb.search_tmdb_media(value, page)

    server_ids = [server.server_id for server in current_user.media_servers]
    for media in media_results:
        db_media = server_media_repo.find_by_external_id_and_server_ids(
            tmdb_id=media.tmdb_id,
            imdb_id=media.imdb_id,
            tvdb_id=media.tvdb_id,
            server_ids=server_ids,
        )
        media.media_servers_info = [
            PlexMediaInfo(**server_media.as_dict()) for server_media in db_media
        ]

    search_result = MediaSearchResult(
        results=[m.dict() for m in media_results],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
    return search_result
