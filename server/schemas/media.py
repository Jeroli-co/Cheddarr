from abc import ABC
from datetime import date
from typing import Optional, Union

from pydantic import AnyHttpUrl, Field

from server.models.media import MediaType, SeriesType
from .core import APIModel, PaginatedResult


###########################################
# Base                                    #
###########################################


class MediaServerInfo(APIModel):
    external_id: str
    added_at: date
    server_id: str
    web_url: Optional[AnyHttpUrl]


class PersonCredits(APIModel):
    cast: "list[Union[SeriesSchema, MovieSchema]]"


class Person(APIModel):
    id: int
    name: str
    also_known_as: Optional[list[str]]
    biography: Optional[str]
    birth_day: Optional[date]
    death_day: Optional[date]
    role: Optional[str]
    credits: Optional[PersonCredits]
    picture_url: Optional[AnyHttpUrl]


class Credits(APIModel):
    cast: list[Person]
    crew: list[Person]


class Company(APIModel):
    name: str


class Video(APIModel):
    video_url: Optional[AnyHttpUrl]


class Genre(APIModel):
    id: int
    name: str


class MediaSchema(APIModel, ABC):
    tmdb_id: Optional[int]
    imdb_id: Optional[str]
    tvdb_id: Optional[int]
    title: str
    summary: Optional[str]
    release_date: Optional[date]
    status: Optional[str]
    poster_url: Optional[str]
    art_url: Optional[str]
    rating: Optional[float]
    duration: Optional[int]
    genres: Optional[list[Genre]]
    studios: Optional[list[Company]]
    credits: Optional[Credits]
    trailers: Optional[list[Video]]
    media_servers_info: list[MediaServerInfo] = []


class MovieSchema(MediaSchema):
    media_type: MediaType = Field(default=MediaType.movie, const=True)
    requests: list = []


class EpisodeSchema(MediaSchema):
    episode_number: int


class SeasonSchema(MediaSchema):
    season_number: int
    episodes: Optional[list[EpisodeSchema]]


class SeriesSchema(MediaSchema):
    number_of_seasons: Optional[int]
    seasons: Optional[list[SeasonSchema]]
    media_type: MediaType = Field(default=MediaType.series, const=True)
    series_type: Optional[SeriesType]
    requests: list = []


class MediaSearchResult(PaginatedResult):
    results: list[Union[SeriesSchema, MovieSchema]]


PersonCredits.update_forward_refs()
