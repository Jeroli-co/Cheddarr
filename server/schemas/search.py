from abc import ABC
from datetime import date
from typing import Generic, Optional, TypeVar, Union

from pydantic import Field, validator
from pydantic.generics import GenericModel

from server.schemas import Episode, Media, Movie, Season, Series

MovieResultType = TypeVar("MovieResultType")
SeriesResultType = TypeVar("SeriesResultType")


class SearchedMedia(Media):
    summary: Optional[str]
    rating: Optional[float]
    genres: Optional[list[str]]


class SearchResult(GenericModel, Generic[MovieResultType, SeriesResultType]):
    page: int = 1
    total_pages: int
    total_results: int
    results: list[Union[SeriesResultType, MovieResultType]]


###########################################
# TMDB                                    #
###########################################

TMDB_URL = "https://www.themoviedb.org"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p"
TMDB_POSTER_SIZE = "w500"
TMDB_ART_SIZE = "w1280"


class TmdbMedia(SearchedMedia, ABC):
    tmdb_id: int = Field(alias="id")
    title: str = Field(alias="name")
    summary: Optional[str] = Field(alias="overview")
    release_date: Optional[date] = Field(alias="release_date")
    status: Optional[str] = Field(alias="status")
    rating: Optional[float] = Field(alias="vote_average")
    poster_url: Optional[str] = Field(alias="poster_path")
    art_url: Optional[str] = Field(alias="backdrop_path")

    @validator("poster_url")
    def get_poster(cls, poster):
        return f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{poster}"

    @validator("art_url")
    def get_art(cls, art):
        return f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{art}"

    @validator("release_date", pre=True)
    def empty_date(cls, v) -> Optional[date]:
        return None if not v else v


class TmdbMovie(TmdbMedia, Movie):
    release_date: str = Field(alias="release_date")


class TmdbEpisode(Episode):
    episode_number: int = Field(alias="episode_number")
    title: str = Field(alias="name")
    release_date: Optional[date] = Field(alias="air_date")

    @validator("release_date", pre=True)
    def empty_date(cls, v) -> Optional[date]:
        return None if not v else v


class TmdbSeason(Season):
    season_number: int = Field(alias="season_number")
    title: str = Field(alias="name")
    release_date: Optional[date] = Field(alias="air_date")
    episodes: Optional[list[TmdbEpisode]] = Field(alias="episodes")


class TmdbSeries(TmdbMedia, Series):
    release_date: Optional[date] = Field(alias="first_air_date", default=None)
    number_of_seasons: Optional[int] = Field(alias="number_of_seasons")
    seasons: Optional[list[TmdbSeason]] = Field(alias="seasons")


class TmdbSearchResult(SearchResult[TmdbSeries, TmdbMovie]):
    pass
