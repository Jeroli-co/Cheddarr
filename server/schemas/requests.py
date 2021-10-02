from abc import ABC
from datetime import datetime
from typing import Optional, Union

from server.models.requests import RequestStatus
from server.schemas.media import MovieSchema, SeriesSchema
from server.schemas.users import UserSchema
from .core import APIModel, PaginatedResult
from ..models.media import MediaType


class MediaRequest(APIModel, ABC):
    id: int
    status: RequestStatus
    requesting_user: UserSchema
    created_at: datetime
    updated_at: datetime
    media_type: MediaType


class MediaRequestCreate(APIModel):
    tmdb_id: int
    root_folder: Optional[str]
    quality_profile_id: Optional[int]
    language_profile_id: Optional[int]


class MediaRequestUpdate(APIModel):
    status: RequestStatus
    provider_id: Optional[str]
    comment: Optional[str]


class MovieRequestSchema(MediaRequest):
    media: MovieSchema


class MovieRequestCreate(MediaRequestCreate):
    ...


class EpisodeRequestSchema(APIModel):
    episode_number: int


class SeasonRequestSchema(APIModel):
    season_number: int
    episodes: Optional[list[EpisodeRequestSchema]]


class SeriesRequestSchema(MediaRequest):
    media: SeriesSchema
    seasons: Optional[list[SeasonRequestSchema]]


class SeriesRequestCreate(MediaRequestCreate):
    seasons: Optional[list[SeasonRequestSchema]]


class MediaRequestSearchResult(PaginatedResult):
    results: list[Union[SeriesRequestSchema, MovieRequestSchema]]
