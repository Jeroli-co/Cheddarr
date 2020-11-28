from abc import ABC
from datetime import date

from pydantic import Field

from server.models import MediaType
from server.schemas import APIModel


class Media(APIModel, ABC):
    tmdb_id: int
    title: str
    release_date: date
    status: str
    poster_url: str
    art_url: str


class Movie(Media):
    media_type: MediaType = Field(default=MediaType.movies, const=True)


class Episode(APIModel):
    episode_number: int
    title: str
    release_date: date


class Season(APIModel):
    season_number: int
    title: str
    release_date: date
    episodes: list[Episode]


class Series(Media):
    tvdb_id: int
    number_of_seasons: int
    seasons: list[Season]
    media_type: MediaType = Field(default=MediaType.series, const=True)
