from abc import ABC
from datetime import date
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, Field, validator

from server.models.media import MediaType, SeriesType
from server.schemas.external_services import MediaServerInfo
from .core import APIModel, PaginatedResult


###########################################
# Base                                    #
###########################################


class PersonSchema(APIModel):
    name: str
    role: Optional[str]
    picture_url: Optional[AnyHttpUrl]


class CreditsSchema(APIModel):
    cast: List[PersonSchema]
    crew: List[PersonSchema]


class CompanySchema(APIModel):
    name: str


class Video(APIModel):
    video_url: Optional[AnyHttpUrl]


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
    genres: Optional[List[str]]
    studios: Optional[List[CompanySchema]]
    credits: Optional[CreditsSchema]
    trailers: Optional[List[Video]]
    media_server_info: Optional[List[MediaServerInfo]]


class MovieSchema(MediaSchema):
    media_type: MediaType = Field(default=MediaType.movies, const=True)
    requests: List = []


class EpisodeSchema(MediaSchema):
    episode_number: int
    title: str
    release_date: Optional[date]


class SeasonSchema(MediaSchema):
    season_number: int
    title: str
    release_date: Optional[date]
    episodes: Optional[List[EpisodeSchema]]


class SeriesSchema(MediaSchema):
    number_of_seasons: Optional[int]
    seasons: Optional[List[SeasonSchema]]
    media_type: MediaType = Field(default=MediaType.series, const=True)
    series_type: Optional[SeriesType]
    requests: List = []


class MediaSearchResult(PaginatedResult):
    results: List[Union[SeriesSchema, MovieSchema]]


###########################################
# TMDB                                    #
###########################################

TMDB_URL = "https://www.themoviedb.org"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p"
TMDB_POSTER_SIZE = "w600_and_h900_bestv2"
TMDB_PROFILE_SIZE = "w185"
TMDB_ART_SIZE = "w1280"


def empty_date(cls, v) -> Optional[date]:
    return None if not v else v


def get_image_url(cls, v, field):
    if v is None:
        return None
    if field.alias == "poster_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{v}"
    if field.alias == "backdrop_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{v}"
    if field.alias == "profile_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_PROFILE_SIZE}/{v}"


class TmdbCast(PersonSchema):
    name: str = Field(alias="name", pre=True)
    role: Optional[str] = Field(alias="character")
    picture_url: Optional[AnyHttpUrl] = Field(alias="profile_path")
    _picture_validator = validator("picture_url", allow_reuse=True, pre=True)(get_image_url)


class TmdbCrew(PersonSchema):
    name: str = Field(alias="name")
    role: Optional[str] = Field(alias="job")
    picture_url: Optional[AnyHttpUrl] = Field(alias="profile_path")
    _picture_validator = validator("picture_url", allow_reuse=True, pre=True)(get_image_url)


class TmdbCredits(CreditsSchema):
    cast: List[TmdbCast] = Field(alias="cast")
    crew: List[TmdbCrew] = Field(alias="crew")


class TmdbCompany(CompanySchema):
    name: str


class TmdbVideo(Video):
    key: str = Field(alias="key")
    type: str = Field(alias="type")
    site: str = Field(alias="site")
    video_url: Optional[AnyHttpUrl]

    @validator("key", pre=True)
    def get_video_url(cls, key, values):
        values["video_url"] = f"https://www.youtube.com/watch?v={key}"
        return key


class TmdbMedia(MediaSchema, ABC):
    tmdb_id: int = Field(alias="id")
    imdb_id: Optional[str] = Field(alias="external_ids.imdb_id")
    tvdb_id: Optional[int] = Field(alias="external_ids.tvdb_id")
    title: str = Field(alias="name")
    summary: Optional[str] = Field(alias="overview")
    status: Optional[str] = Field(alias="status")
    rating: Optional[float] = Field(alias="vote_average")
    poster_url: Optional[AnyHttpUrl] = Field(alias="poster_path")
    art_url: Optional[AnyHttpUrl] = Field(alias="backdrop_path")
    credits: Optional[TmdbCredits] = Field(alias="credits")
    trailers: Optional[List[TmdbVideo]] = Field(alias="videos")
    _poster_validator = validator("poster_url", allow_reuse=True, pre=True)(get_image_url)
    _art_validator = validator("art_url", allow_reuse=True, pre=True)(get_image_url)


class TmdbMovie(TmdbMedia, MovieSchema):
    duration: Optional[int] = Field(alias="runtime")
    studios: Optional[List[TmdbCompany]] = Field(alias="production_companies")
    release_date: Optional[date] = Field(alias="release_date")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)


class TmdbEpisode(TmdbMedia, EpisodeSchema):
    episode_number: int = Field(alias="episode_number")
    title: str = Field(alias="name")
    release_date: Optional[date] = Field(alias="air_date")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)


class TmdbSeason(TmdbMedia, SeasonSchema):
    season_number: int = Field(alias="season_number")
    title: str = Field(alias="name")
    episodes: Optional[List[TmdbEpisode]] = Field(alias="episodes")
    release_date: Optional[date] = Field(alias="air_date")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)


class TmdbSeries(TmdbMedia, SeriesSchema):
    number_of_seasons: Optional[int] = Field(alias="number_of_seasons")
    seasons: Optional[List[TmdbSeason]] = Field(alias="seasons")
    studios: Optional[List[TmdbCompany]] = Field(alias="networks")
    release_date: Optional[date] = Field(alias="first_air_date")
    _date_validator = validator("release_date", allow_reuse=True, pre=True)(empty_date)
    credits: Optional[TmdbCredits] = Field(alias="aggregate_credits")
