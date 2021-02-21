from abc import ABC
from datetime import date
from typing import List, Optional


from server.models import MediaType, SeriesType
from server.schemas import APIModel, PlexMediaInfo


class Media(APIModel, ABC):
    tmdb_id: int
    title: str
    summary: Optional[str]
    release_date: Optional[date]
    status: Optional[str]
    poster_url: Optional[str]
    art_url: Optional[str]
    rating: Optional[float]
    duration: Optional[int]
    studio: Optional[str]
    genres: Optional[List[str]]
    actors: Optional[List[str]]
    directors: Optional[List[str]]
    plex_media_info: Optional[PlexMediaInfo]


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
    tvdb_id: int
    number_of_seasons: Optional[int]
    seasons: Optional[List[Season]]
    media_type: MediaType
    series_type: Optional[SeriesType]
