from collections.abc import Sequence
from enum import Enum

from server.schemas.base import PaginatedResponse
from server.schemas.media import MediaSearchResponse, Person


class SearchType(str, Enum):
    movie = "movies"
    series = "series"
    people = "people"


class PersonSearchResponse(PaginatedResponse):
    items = Sequence[Person]


class MultiSearchResponse(PaginatedResponse):
    __root__ = MediaSearchResponse | PersonSearchResponse
