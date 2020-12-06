from abc import ABC
from datetime import date
from typing import Optional

from pydantic import Field

from server.models import MediaType, SeriesType
from server.schemas import APIModel


class Media(APIModel, ABC):
    title: str
    release_date: date
    status: str
    poster_url: str
    art_url: str


class Movie(Media):
    tmdb_id: int
    media_type: MediaType = Field(default=MediaType.movies, const=True)


class Episode(APIModel):
    episode_number: int
    title: str
    release_date: Optional[date]


class Season(APIModel):
    season_number: int
    title: str
    release_date: date
    episodes: Optional[list[Episode]]


class Series(Media):
    tvdb_id: int
    number_of_seasons: int
    seasons: Optional[list[Season]]
    media_type: MediaType = Field(default=MediaType.series, const=True)
    series_type: SeriesType
