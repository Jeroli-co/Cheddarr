from __future__ import annotations

from abc import ABC
from collections.abc import Sequence
from datetime import date, datetime
from typing import Annotated, Any, Literal

from pydantic import BaseModel, Field

from server.models.media import MediaType
from server.schemas.base import APIModel


class MediaServerInfo(BaseModel):
    external_id: str
    added_at: datetime
    server_id: str
    web_url: str | None = None


class PersonCredits(BaseModel):
    cast: Sequence[SeriesSchema | MovieSchema]


class Person(BaseModel):
    id: int
    name: str
    also_known_as: list[str] | None = None
    biography: str | None = None
    birth_day: date | None = None
    death_day: date | None = None
    role: str | None = None
    credits: PersonCredits | None = None
    picture_url: str | None = None


class Credits(BaseModel):
    cast: Sequence[Person]
    crew: Sequence[Person]


class Company(BaseModel):
    name: str


class Video(BaseModel):
    video_url: str | None = None


class Genre(BaseModel):
    id: int
    name: str


class MediaSchemaBase(APIModel, ABC):
    tmdb_id: int | None = None
    imdb_id: str | None = None
    tvdb_id: int | None = None
    title: str
    summary: str | None = None
    release_date: date | None = None
    status: str | None = None
    poster_url: str | None = None
    art_url: str | None = None
    rating: float | None = None
    duration: int | None = None
    genres: Sequence[Genre] | None = None
    studios: Sequence[Company] | None = None
    credits: Credits | None = None
    trailers: Sequence[Video] | None = None
    media_servers_info: list[MediaServerInfo] = []


class MovieSchema(MediaSchemaBase):
    requests: Sequence[Any] = []  # TODO: This is a hack to get around circular imports, fix this
    media_type: Literal[MediaType.movie] = Field(MediaType.movie, init_var=False)


class EpisodeSchema(MediaSchemaBase):
    episode_number: int


class SeasonSchema(MediaSchemaBase):
    season_number: int
    episodes: Sequence[EpisodeSchema] | None = None


class SeriesSchema(MediaSchemaBase):
    number_of_seasons: int | None = None
    seasons: Sequence[SeasonSchema] | None = None
    requests: Sequence[Any] = []  # TODO: This is a hack to get around circular imports, fix this
    media_type: Literal[MediaType.series] = Field(MediaType.series, init_var=False)


MediaSchema = Annotated[SeriesSchema | MovieSchema, Field(discriminator="media_type")]


Person.model_rebuild()
