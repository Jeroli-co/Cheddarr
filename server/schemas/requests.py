from abc import ABC
from typing import List, Optional

from server.models import RequestStatus, SeriesType
from server.schemas import APIModel, Movie, Series, UserPublic


class Request(APIModel, ABC):
    id: int
    request_status: RequestStatus
    requested_user: UserPublic
    requesting_user: UserPublic


class MovieRequest(Request):
    media: Movie


class MovieRequestCreate(APIModel):
    tmdb_id: int
    requested_username: str


class EpisodeRequest(APIModel):
    episode_number: int


class SeasonRequest(APIModel):
    season_number: int
    episodes: Optional[List[EpisodeRequest]]


class SeriesRequest(Request):
    tvdb_id: int
    series_type: SeriesType
    media: Series


class SeriesRequestCreate(APIModel):
    tvdb_id: int
    requested_username: str
    seasons: Optional[List[SeasonRequest]]
