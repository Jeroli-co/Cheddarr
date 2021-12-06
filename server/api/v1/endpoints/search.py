from fastapi import APIRouter, Depends

from server.api import dependencies as deps
from server.repositories.media import MediaServerMediaRepository
from server.schemas.search import MultiSearchResult, SearchType
from server.services import tmdb
from server.services.plex import PlexMediaInfo

router = APIRouter()


@router.get(
    "",
    response_model=MultiSearchResult,
    response_model_exclude_none=True,
    dependencies=[Depends(deps.get_current_user)],
)
async def multi_search(
    value: str,
    page: int = 1,
    type: SearchType = None,
    server_media_repo: MediaServerMediaRepository = Depends(
        deps.get_repository(MediaServerMediaRepository)
    ),
):
    if type == SearchType.series:
        results, total_pages, total_results = await tmdb.search_tmdb_series(value, page)
    elif type == SearchType.movie:
        results, total_pages, total_results = await tmdb.search_tmdb_movies(value, page)
    elif type == SearchType.people:
        results, total_pages, total_results = await tmdb.search_people(value, page)
    else:
        results, total_pages, total_results = await tmdb.search_tmdb_media(value, page)

    if type != SearchType.people:
        for media in results:
            db_media = await server_media_repo.find_by_media_external_id(
                tmdb_id=media.tmdb_id,
                imdb_id=media.imdb_id,
                tvdb_id=media.tvdb_id,
            )
            media.media_servers_info = [
                PlexMediaInfo(**server_media.as_dict()) for server_media in db_media
            ]
    search_result = MultiSearchResult(
        results=[m.dict() for m in results],
        page=page,
        total_pages=total_pages,
        total_results=total_results,
    )
    return search_result
