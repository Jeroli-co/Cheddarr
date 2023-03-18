from abc import ABC
from datetime import datetime

from server.models.media import MediaType
from server.models.requests import RequestStatus
from server.schemas.media import MovieSchema, SeriesSchema
from server.schemas.users import UserProfile

from .base import APIModel, PaginatedResponse


class MediaRequest(APIModel, ABC):
    id: int
    status: RequestStatus
    requesting_user: UserProfile
    created_at: datetime
    updated_at: datetime
    media_type: MediaType


class MediaRequestCreate(APIModel):
    tmdb_id: int
    root_folder: str | None
    quality_profile_id: int | None
    language_profile_id: int | None


class MediaRequestUpdate(APIModel):
    status: RequestStatus
    provider_id: str | None
    comment: str | None


class MovieRequestSchema(MediaRequest):
    media: MovieSchema


class MovieRequestCreate(MediaRequestCreate):
    ...


class EpisodeRequestSchema(APIModel):
    episode_number: int


class SeasonRequestSchema(APIModel):
    season_number: int
    episode_requests: list[EpisodeRequestSchema] | None


class SeriesRequestSchema(MediaRequest):
    media: SeriesSchema
    season_requests: list[SeasonRequestSchema] | None


class SeriesRequestCreate(MediaRequestCreate):
    season_requests: list[SeasonRequestSchema] | None


class MediaRequestSearchResponse(PaginatedResponse):
    items: list[SeriesRequestSchema | MovieRequestSchema]
