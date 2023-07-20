from enum import StrEnum
from typing import Any

from fastapi import APIRouter, Depends

from server.api import dependencies as deps
from server.schemas.base import PaginatedResponse
from server.schemas.media import MediaSchema, MovieSchema, Person, SeriesSchema
from server.services import tmdb
from server.services.media import MediaService

router = APIRouter()


class SearchType(StrEnum):
    movie = "movies"
    series = "series"
    people = "people"


@router.get(
    "",
    response_model=PaginatedResponse[SeriesSchema | MovieSchema | Person],
    response_model_exclude_none=True,
    dependencies=[Depends(deps.get_current_user)],
)
async def multi_search(
    value: str,
    page: int = 1,
    type: SearchType | None = None,
    *,
    media_service: MediaService = Depends(deps.get_service(MediaService)),
) -> PaginatedResponse[Any]:
    results: PaginatedResponse[Any]
    if type == SearchType.series:
        results = PaginatedResponse[SeriesSchema].model_validate(
            await tmdb.search_tmdb_series(value, page),
        )
    elif type == SearchType.movie:
        results = PaginatedResponse[MovieSchema].model_validate(
            await tmdb.search_tmdb_movies(value, page),
        )
    elif type == SearchType.people:
        results = PaginatedResponse[Person].model_validate(
            await tmdb.search_people(value, page),
        )
    else:
        results = PaginatedResponse[MediaSchema].model_validate(
            await tmdb.search_tmdb_media(value, page),
        )

    if type == SearchType.movie or type == SearchType.series:
        for media in results.results:
            if isinstance(media, SeriesSchema | MovieSchema):
                await media_service.set_media_db_info(media)

    return results
