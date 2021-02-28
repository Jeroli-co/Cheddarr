from abc import ABC
from datetime import date
from typing import List, Optional

from pydantic import AnyHttpUrl

from server.models import MediaType, SeriesType
from server.schemas import APIModel, PlexMediaInfo


class Person(APIModel):
    name: str
    role: str
    picture_url: Optional[AnyHttpUrl]


class Credits(APIModel):
    cast: List[Person]
    crew: List[Person]


class Company(APIModel):
    name: str


class Media(APIModel, ABC):
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
    genres: Optional[List[str]]
    studios: Optional[List[Company]]
    credits: Optional[Credits]
    plex_media_info: Optional[List[PlexMediaInfo]]


class Movie(Media):
    media_type: MediaType


class Episode(Media):
    episode_number: int
    title: str
    release_date: Optional[date]


class Season(Media):
    season_number: int
    title: str
    release_date: Optional[date]
    episodes: Optional[List[Episode]]


class Series(Media):
    number_of_seasons: Optional[int]
    seasons: Optional[List[Season]]
    media_type: MediaType
    series_type: Optional[SeriesType]
