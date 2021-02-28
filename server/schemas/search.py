from abc import ABC
from datetime import date
from typing import List, Optional, TypeVar, Union

from pydantic import AnyHttpUrl, Field, validator

from server.schemas import APIModel, Episode, Media, Movie, Season, Series
from server.schemas.media import Person

MovieResultType = TypeVar("MovieResultType")
SeriesResultType = TypeVar("SeriesResultType")


class SearchResult(APIModel):
    page: int = 1
    total_pages: int
    total_results: int
    results: List[Union[Series, Movie]]


###########################################
# TMDB                                    #
###########################################

TMDB_URL = "https://www.themoviedb.org"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p"
TMDB_POSTER_SIZE = "w500"
TMDB_PROFILE_SIZE = "w185"
TMDB_ART_SIZE = "w1280"


def empty_date(cls, v) -> Optional[date]:
    return None if not v else v


class TmdbCast(Person):
    name: str = Field(alias="name", pre=True)
    role: str = Field(alias="character")
    picture_url: Optional[AnyHttpUrl] = Field(alias="profile_path")

    @validator("picture_url", pre=True)
    def get_picture(cls, poster):
        return f"{TMDB_IMAGES_URL}/{TMDB_PROFILE_SIZE}/{poster}"


class TmdbCrew(Person):
    name: str = Field(alias="name")
    role: str = Field(alias="job")
    picture_url: Optional[AnyHttpUrl] = Field(alias="profile_path")

    @validator("picture_url")
    def get_picture(cls, poster):
        return f"{TMDB_IMAGES_URL}/{TMDB_PROFILE_SIZE}/{poster}"


class TmdbMedia(Media, ABC):
    tmdb_id: int = Field(alias="id")
    imdb_id: Optional[str] = Field(alias="external_ids.imdb_id")
    tvdb_id: Optional[int] = Field(alias="external_ids.tvdb_id")
    title: str = Field(alias="name")
    summary: Optional[str] = Field(alias="overview")
    status: Optional[str] = Field(alias="status")
    rating: Optional[float] = Field(alias="vote_average")
    poster_url: Optional[AnyHttpUrl] = Field(alias="poster_path")
    art_url: Optional[AnyHttpUrl] = Field(alias="backdrop_path")
    cast: Optional[List[TmdbCast]] = Field(alias="credits.cast")
    crew: Optional[List[TmdbCrew]] = Field(alias="credits.crew")

    @validator("poster_url", pre=True)
    def get_poster(cls, poster):
        return f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{poster}"

    @validator("art_url", pre=True)
    def get_art(cls, art):
        return f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{art}"


class TmdbMovie(TmdbMedia, Movie):
    release_date: Optional[date] = Field(alias="release_date")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)


class TmdbEpisode(TmdbMedia, Episode):
    episode_number: int = Field(alias="episode_number")
    title: str = Field(alias="name")
    release_date: Optional[date] = Field(alias="air_date")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)


class TmdbSeason(TmdbMedia, Season):
    season_number: int = Field(alias="season_number")
    title: str = Field(alias="name")
    release_date: Optional[date] = Field(alias="air_date")
    episodes: Optional[List[TmdbEpisode]] = Field(alias="episodes")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)


class TmdbSeries(TmdbMedia, Series):
    release_date: Optional[date] = Field(alias="first_air_date", default=None)
    number_of_seasons: Optional[int] = Field(alias="number_of_seasons")
    seasons: Optional[List[TmdbSeason]] = Field(alias="seasons")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)
