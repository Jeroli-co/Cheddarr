from fastapi import APIRouter, Depends

from server.api import dependencies as deps
from server.schemas.search import MultiSearchResponse, SearchType
from server.services import tmdb
from server.services.media import MediaService

router = APIRouter()


@router.get(
    "",
    response_model=MultiSearchResponse,
    response_model_exclude_none=True,
    dependencies=[Depends(deps.get_current_user)],
)
async def multi_search(
    value: str,
    page: int = 1,
    type: SearchType | None = None,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> MultiSearchResponse:
    if type == SearchType.series:
        results = MultiSearchResponse.parse_obj(await tmdb.search_tmdb_series(value, page))
    elif type == SearchType.movie:
        results = MultiSearchResponse.parse_obj(await tmdb.search_tmdb_movies(value, page))
    elif type == SearchType.people:
        results = MultiSearchResponse.parse_obj(await tmdb.search_people(value, page))
    else:
        results = MultiSearchResponse.parse_obj(await tmdb.search_tmdb_media(value, page))

    if type == SearchType.movie or type == SearchType.series:
        for media in results.items:
            await media_service.set_media_db_info(media)

    return results
