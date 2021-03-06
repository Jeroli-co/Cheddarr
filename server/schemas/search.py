from typing import List, Union

from server.schemas.media import MovieSchema, SeriesSchema
from .base import APIModel


class SearchResult(APIModel):
    page: int = 1
    total_pages: int
    total_results: int
    results: List[Union[SeriesSchema, MovieSchema]]
