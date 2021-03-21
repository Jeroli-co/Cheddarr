from abc import ABC
from datetime import datetime
from typing import List, Optional, Union

from server.models.requests import RequestStatus
from server.schemas.media import MovieSchema, SeriesSchema
from server.schemas.users import UserPublicSchema
from .core import APIModel, PaginatedResult
from ..models.media import MediaType


class MediaRequest(APIModel, ABC):
    id: int
    status: RequestStatus
    requested_user: UserPublicSchema
    requesting_user: UserPublicSchema
    created_at: datetime
    updated_at: datetime
    media_type: MediaType


class MediaRequestCreate(APIModel):
    tmdb_id: int
    requested_username: str


class MediaRequestUpdate(APIModel):
    status: RequestStatus
    provider_id: Optional[str]


class MovieRequestSchema(MediaRequest):
    media: MovieSchema


class MovieRequestCreate(MediaRequestCreate):
    pass


class EpisodeRequestSchema(APIModel):
    episode_number: int


class SeasonRequestSchema(APIModel):
    season_number: int
    episodes: Optional[List[EpisodeRequestSchema]]


class SeriesRequestSchema(MediaRequest):
    media: SeriesSchema
    seasons: Optional[List[SeasonRequestSchema]]


class SeriesRequestCreate(MediaRequestCreate):
    seasons: Optional[List[SeasonRequestSchema]]


class MediaRequestSearchResult(PaginatedResult):
    results: List[Union[SeriesRequestSchema, MovieRequestSchema]]
