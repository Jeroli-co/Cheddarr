from __future__ import annotations

from abc import ABC
from datetime import datetime
from typing import Generic, TypeVar

from pydantic import Field

from server.models.media import MediaType
from server.models.requests import RequestStatus
from server.schemas.media import MediaSchemaBase, MovieSchema, SeriesSchema
from server.schemas.users import UserProfile

from .base import APIModel

MediaSchemaType = TypeVar("MediaSchemaType", bound=MediaSchemaBase)


class MediaRequestBase(APIModel, Generic[MediaSchemaType], ABC):
    id: int
    status: RequestStatus
    requesting_user: UserProfile
    created_at: datetime
    updated_at: datetime
    media_type: MediaType
    media: MediaSchemaType


class MediaRequestCreate(APIModel):
    tmdb_id: int
    root_folder: str | None = None
    quality_profile_id: int | None = None
    tags: list[int] | None = None


class MediaRequestUpdate(APIModel):
    status: RequestStatus
    provider_id: str | None = None
    comment: str | None = None


class MovieRequestSchema(MediaRequestBase[MovieSchema]):
    ...


class MovieRequestCreate(MediaRequestCreate):
    ...


class EpisodeRequestSchema(APIModel):
    episode_number: int


class SeasonRequestSchema(APIModel):
    season_number: int
    episode_requests: list[EpisodeRequestSchema] | None = Field(None, alias="episodes")


class SeriesRequestSchema(MediaRequestBase[SeriesSchema]):
    season_requests: list[SeasonRequestSchema] | None = Field(None, alias="seasons")


class SeriesRequestCreate(MediaRequestCreate):
    season_requests: list[SeasonRequestSchema] | None = Field(None, alias="seasons")


MediaRequestSchema = SeriesRequestSchema | MovieRequestSchema
