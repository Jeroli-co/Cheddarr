from __future__ import annotations

from abc import ABC
from typing import TYPE_CHECKING

from pydantic import AnyHttpUrl, BaseModel, Field

from server.models.media import MediaType, SeriesType

from .base import APIModel, PaginatedResponse

if TYPE_CHECKING:
    from collections.abc import Sequence
    from datetime import date

    from .requests import MovieRequestSchema, SeriesRequestSchema

###########################################
# Base                                    #
###########################################


class MediaServerInfo(APIModel):
    external_id: str
    added_at: date
    server_id: str
    web_url: AnyHttpUrl | None


class PersonCredits(APIModel):
    cast: Sequence[SeriesSchema | MovieSchema]


class Person(APIModel):
    id: int
    name: str
    also_known_as: list[str] | None
    biography: str | None
    birth_day: date | None
    death_day: date | None
    role: str | None
    credits: PersonCredits | None
    picture_url: AnyHttpUrl | None


class Credits(BaseModel):
    cast: Sequence[Person]
    crew: Sequence[Person]


class Company(BaseModel):
    name: str


class Video(BaseModel):
    video_url: AnyHttpUrl | None


class Genre(APIModel):
    id: int
    name: str


class MediaSchema(APIModel, ABC):
    tmdb_id: int | None
    imdb_id: str | None
    tvdb_id: int | None
    title: str
    summary: str | None
    release_date: date | None
    status: str | None
    poster_url: str | None
    art_url: str | None
    rating: float | None
    duration: int | None
    genres: Sequence[Genre] | None
    studios: Sequence[Company] | None
    credits: Credits | None
    trailers: Sequence[Video] | None
    media_servers_info: list[MediaServerInfo] = []


class MovieSchema(MediaSchema):
    media_type: MediaType = Field(default=MediaType.movie, const=True)
    requests: Sequence[MovieRequestSchema] = []


class EpisodeSchema(MediaSchema):
    episode_number: int


class SeasonSchema(MediaSchema):
    season_number: int
    episodes: Sequence[EpisodeSchema] | None


class SeriesSchema(MediaSchema):
    number_of_seasons: int | None
    seasons: Sequence[SeasonSchema] | None
    media_type: MediaType = Field(default=MediaType.series, const=True)
    series_type: SeriesType | None
    requests: Sequence[SeriesRequestSchema] = []


class MediaSearchResponse(PaginatedResponse):
    items: Sequence[SeriesSchema | MovieSchema]
