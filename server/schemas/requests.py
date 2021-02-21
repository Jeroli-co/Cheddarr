from abc import ABC
from datetime import date
from typing import List, Optional

from server.models import RequestStatus
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
    media: Movie


class RequestCreate(APIModel):
    tmdb_id: int
    requested_username: str


class MovieRequestCreate(RequestCreate):
    pass


class EpisodeRequest(APIModel):
    episode_number: int


class SeasonRequest(APIModel):
    season_number: int
    episodes: Optional[List[EpisodeRequest]]


class SeriesRequest(Request):
    media: Series
    seasons: Optional[List[SeasonRequest]]


class SeriesRequestCreate(RequestCreate):
    seasons: Optional[List[SeasonRequest]]
