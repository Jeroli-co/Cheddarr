from abc import ABC
from datetime import date
from typing import Optional

from server.models import RequestStatus, SeriesType
from server.schemas import APIModel, Movie, Series, UserPublic


class Request(APIModel, ABC):
    id: int
    status: RequestStatus
    requested_user: UserPublic
    requesting_user: UserPublic
    created_at: date
    updated_at: date


class RequestUpdate(APIModel):
    status: RequestStatus
    provider_id: Optional[str]


class MovieRequest(Request):
    movie: Movie


class MovieRequestCreate(APIModel):
    tmdb_id: int
    requested_username: str


class EpisodeRequest(APIModel):
    episode_number: int


class SeasonRequest(APIModel):
    season_number: int
    episodes: Optional[list[EpisodeRequest]]


class SeriesRequest(Request):
    series: Series
    seasons: Optional[list[SeasonRequest]]


class SeriesRequestCreate(APIModel):
    tvdb_id: int
    requested_username: str
    seasons: Optional[list[SeasonRequest]]
