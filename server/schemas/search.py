from abc import ABC
from datetime import date
from typing import Generic, List, Optional, TypeVar, Union

from pydantic import Field, validator
from pydantic.generics import GenericModel
from server.schemas import Media, Movie, Series, Season, Episode

MovieResultType = TypeVar("MovieResultType")
SeriesResultType = TypeVar("SeriesResultType")


class SearchResult(GenericModel, Generic[MovieResultType, SeriesResultType]):
    page: int = 1
    total_pages: int
    total_results: int
    results: List[Union[SeriesResultType, MovieResultType]]


###########################################
# TMDB                                    #
###########################################

TMDB_URL = "https://www.themoviedb.org"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p"
TMDB_POSTER_SIZE = "w500"
TMDB_ART_SIZE = "w1280"


class TmdbMedia(Media, ABC):
    tmdb_id: int = Field(alias="id")
    title: str = Field(alias="name")
    summary: str = Field(alias="overview")
    release_date: str = Field(alias="release_date")
    status: Optional[str] = Field(alias="status")
    rating: float = Field(alias="vote_average")
    poster_url: str = Field(alias="poster_path")
    art_url: Optional[str] = Field(alias="backdrop_path")

    @validator("poster_url")
    def get_poster(cls, poster):
        return f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{poster}"

    @validator("art_url")
    def get_art(cls, art):
        return f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{art}"


class TmdbMovie(TmdbMedia, Movie):
    release_date: str = Field(alias="release_date")


class TmdbEpisode(Episode):
    episode_number: int = Field(alias="episode_number")
    title: str = Field(alias="name")
    release_date: date = Field(alias="air_date")


class TmdbSeason(Season):
    season_number: int = Field(alias="season_number")
    title: str = Field(alias="name")
    release_date: date = Field(alias="air_date")
    episodes: Optional[List[TmdbEpisode]] = Field(alias="episodes")


class TmdbSeries(TmdbMedia, Series):
    release_date: str = Field(alias="first_air_date")
    number_of_seasons: Optional[int] = Field(alias="number_of_seasons")
    seasons: Optional[List[TmdbSeason]] = Field(alias="seasons")


class TmdbSearchResult(SearchResult[TmdbSeries, TmdbMovie]):
    pass
