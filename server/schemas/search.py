from enum import Enum
from typing import Union

from server.schemas.core import PaginatedResult
from server.schemas.media import MovieSchema, Person, SeriesSchema


class SearchType(str, Enum):
    movie = "movies"
    series = "series"
    people = "people"


class MultiSearchResult(PaginatedResult):
    results: list[Union[Person, SeriesSchema, MovieSchema]]
