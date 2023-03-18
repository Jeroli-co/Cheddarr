from __future__ import annotations

import re
from abc import ABC
from typing import TYPE_CHECKING, Any

from pydantic import AnyHttpUrl, Field, root_validator, validator

from server.models.media import MediaType, SeriesType
from server.schemas.media import (
    Company,
    Credits,
    EpisodeSchema,
    Genre,
    MediaSchema,
    MovieSchema,
    Person,
    PersonCredits,
    SeasonSchema,
    SeriesSchema,
    Video,
)

if TYPE_CHECKING:
    from collections.abc import Sequence

    from server.schemas.base import Date

###################################
# Constants                       #
###################################
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p"
TMDB_POSTER_SIZE = "w600_and_h900_bestv2"
TMDB_PROFILE_SIZE = "w185"
TMDB_ART_SIZE = "w1280"


###################################
# Validators                      #
###################################
def get_image_url(cls, v, field):
    if v is None:
        return None
    if field.alias == "poster_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{v}"
    if field.alias == "backdrop_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{v}"
    if field.alias == "profile_path":
        return f"{TMDB_IMAGES_URL}/{TMDB_PROFILE_SIZE}/{v}"
    return None


def set_tmdb_movie_info(cls, values):
    values["media_type"] = MediaType.movie
    values["videos"] = [
        video
        for video in values.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]
    return values


def set_tmdb_series_info(cls, values):
    values["media_type"] = MediaType.series
    values["series_type"] = SeriesType.standard
    anime_pattern = re.compile("(?i)anim(e|ation)")
    for genre in values.get("genres", []):
        if anime_pattern.match(genre["name"]):
            values["series_type"] = SeriesType.anime
            break
    values["videos"] = [
        video
        for video in values.get("videos", {}).get("results", [])
        if video["type"] == "Trailer" and video["site"] == "YouTube"
    ]
    return values


###################################
# Schemas                         #
###################################
class TmdbPersonCredits(PersonCredits):
    cast: Sequence[TmdbSeries | TmdbMovie]


class TmdbPerson(Person):
    name: str = Field(alias="name", pre=True)
    also_known_as: list[str] | None = Field(alias="also_known_as")
    biography: str | None = Field(alias="biography")
    birth_day: Date | None = Field(alias="birthday")
    death_day: Date | None = Field(alias="deathday")
    credits: TmdbPersonCredits | None = Field(alias="combined_credits")
    picture_url: AnyHttpUrl | None = Field(alias="profile_path")
    _picture_validator = validator("picture_url", allow_reuse=True, pre=True)(get_image_url)


class TmdbCast(TmdbPerson):
    role: str | None = Field(alias="character")


class TmdbCrew(TmdbPerson):
    role: str | None = Field(alias="job")


class TmdbCredits(Credits):
    cast: Sequence[TmdbCast] = Field(alias="cast")
    crew: Sequence[TmdbCrew] = Field(alias="crew")


class TmdbCompany(Company):
    name: str


class TmdbVideo(Video):
    key: str = Field(alias="key")
    type: str = Field(alias="type")
    site: str = Field(alias="site")
    video_url: AnyHttpUrl | None

    @classmethod
    @validator("key", pre=True)
    def get_video_url(cls, key: str, values: dict[str, Any]) -> str:
        values["video_url"] = f"https://www.youtube.com/watch?v={key}"
        return key


class TmdbMedia(MediaSchema, ABC):
    tmdb_id: int = Field(alias="id")
    external_ids: dict[str, Any] | None = Field(alias="external_ids", default={})
    title: str = Field(alias="name")
    summary: str | None = Field(alias="overview")
    genres: Sequence[Genre] | None = Field(alias="genres")
    status: str | None = Field(alias="status")
    rating: float | None = Field(alias="vote_average")
    poster_url: AnyHttpUrl | None = Field(alias="poster_path")
    art_url: AnyHttpUrl | None = Field(alias="backdrop_path")
    credits: TmdbCredits | None = Field(alias="credits")
    trailers: Sequence[TmdbVideo] | None = Field(alias="videos")
    _poster_validator = validator("poster_url", allow_reuse=True, pre=True)(get_image_url)
    _art_validator = validator("art_url", allow_reuse=True, pre=True)(get_image_url)

    @classmethod
    @root_validator(pre=True)
    def get_external_ids(cls, values: dict[str, Any]) -> dict[str, str | int]:
        values["tvdb_id"] = values.get("external_ids", {}).get("tvdb_id")
        values["imdb_id"] = values.get("external_ids", {}).get("imdb_id")
        return values


class TmdbMovie(TmdbMedia, MovieSchema):
    duration: int | None = Field(alias="runtime")
    studios: Sequence[TmdbCompany] | None = Field(alias="production_companies")
    release_date: Date | None = Field(alias="release_date")
    _movie_validator = root_validator(allow_reuse=True, pre=True)(set_tmdb_movie_info)


class TmdbEpisode(TmdbMedia, EpisodeSchema):
    episode_number: int = Field(alias="episode_number")
    release_date: Date | None = Field(alias="air_date")


class TmdbSeason(TmdbMedia, SeasonSchema):
    season_number: int = Field(alias="season_number")
    episodes: Sequence[TmdbEpisode] | None = Field(alias="episodes")
    release_date: Date | None = Field(alias="air_date")


class TmdbSeries(TmdbMedia, SeriesSchema):
    number_of_seasons: int | None = Field(alias="number_of_seasons")
    seasons: Sequence[TmdbSeason] | None = Field(alias="seasons")
    studios: Sequence[TmdbCompany] | None = Field(alias="networks")
    release_date: Date | None = Field(alias="first_air_date")
    credits: TmdbCredits | None = Field(alias="aggregate_credits")
    _series_validator = root_validator(allow_reuse=True, pre=True)(set_tmdb_series_info)
