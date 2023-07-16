from __future__ import annotations

from abc import ABC
from collections.abc import Sequence
from datetime import date
from typing import Annotated, Any

from pydantic import AliasChoices, AliasPath, BeforeValidator, Field, field_validator
from pydantic_core.core_schema import FieldValidationInfo

from server.schemas.media import (
    Company,
    Credits,
    EpisodeSchema,
    Genre,
    MediaSchemaBase,
    MovieSchema,
    Person,
    PersonCredits,
    SeasonSchema,
    SeriesSchema,
    Video,
)

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
TmdbDate = Annotated[
    date | None,
    BeforeValidator(lambda v: None if v is not None and not isinstance(v, date) and len(v) == 0 else v),
]
TmdbPoster = Annotated[str | None, BeforeValidator(lambda v: f"{TMDB_IMAGES_URL}/{TMDB_POSTER_SIZE}/{v}")]
TmdbArt = Annotated[str | None, BeforeValidator(lambda v: f"{TMDB_IMAGES_URL}/{TMDB_ART_SIZE}/{v}")]
TmdbPicture = Annotated[str | None, BeforeValidator(lambda v: f"{TMDB_IMAGES_URL}/{TMDB_PROFILE_SIZE}/{v}")]


###################################
# Schemas                         #
###################################
class TmdbPersonCredits(PersonCredits):
    cast: Sequence[TmdbSeries | TmdbMovie] = Field(alias="cast")


class TmdbPerson(Person):
    name: str = Field(alias="name", mode="before")
    also_known_as: list[str] | None = Field(alias="also_known_as", default=None)
    biography: str | None = Field(alias="biography", default=None)
    birth_day: TmdbDate = Field(alias="birthday", default=None)
    death_day: TmdbDate = Field(alias="deathday", default=None)
    credits: TmdbPersonCredits | None = Field(alias="credits", default=None)
    picture_url: TmdbPicture = Field(alias="profile_path")


class TmdbCast(TmdbPerson):
    role: str | None = Field(alias="character")


class TmdbCrew(TmdbPerson):
    role: str | None = Field(alias="job")


class TmdbCredits(Credits):
    cast: Sequence[TmdbCast] = Field(alias="cast")
    crew: Sequence[TmdbCrew] = Field(alias="crew")


class TmdbCompany(Company):
    name: str = Field(alias="name")


class TmdbGenre(Genre):
    name: str = Field(alias="name")


class TmdbVideo(Video):
    type: str = Field(alias="type")
    site: str = Field(alias="site")
    key: str = Field(alias="key")
    video_url: str | None = None

    @field_validator("key")
    def get_video_url(cls, key: str, info: FieldValidationInfo) -> str:
        if info.data.get("site") == "YouTube" and info.data.get("type") == "Trailer":
            info.data["video_url"] = f"https://www.youtube.com/watch?v={key}"
        return key


class TmdbMedia(MediaSchemaBase, ABC):
    tmdb_id: int = Field(alias="id")
    tvdb_id: int | None = Field(validation_alias=AliasPath("external_ids", "tvdb_id"), default=None)
    imdb_id: str | None = Field(validation_alias=AliasPath("external_ids", "imdb_id"), default=None)
    external_ids: dict[str, Any] | None = Field(alias="external_ids", default={})
    summary: str | None = Field(alias="overview")
    poster_url: TmdbPoster = Field(validation_alias=AliasChoices("poster_path", "still_path"))
    art_url: TmdbArt = Field(alias="backdrop_path", default=None)
    genres: Sequence[TmdbGenre] | None = Field(alias="genres", default=None)
    status: str | None = Field(alias="status", default=None)
    rating: float | None = Field(alias="vote_average", default=None)
    credits: TmdbCredits | None = Field(alias="credits", default=None)
    trailers: Sequence[TmdbVideo] | None = Field(validation_alias=AliasPath("videos", "results"), default=None)


class TmdbMovie(TmdbMedia, MovieSchema):
    title: str = Field(alias="title")
    release_date: TmdbDate = Field(alias="release_date")
    duration: int | None = Field(alias="runtime", default=None)
    studios: Sequence[TmdbCompany] | None = Field(alias="production_companies", default=None)


class TmdbEpisode(TmdbMedia, EpisodeSchema):
    title: str = Field(alias="name")
    episode_number: int = Field(alias="episode_number")
    release_date: TmdbDate = Field(alias="air_date")


class TmdbSeason(TmdbMedia, SeasonSchema):
    title: str = Field(alias="name")
    season_number: int = Field(alias="season_number")
    release_date: TmdbDate = Field(alias="air_date")
    episodes: Sequence[TmdbEpisode] | None = Field(alias="episodes", default=None)


class TmdbSeries(TmdbMedia, SeriesSchema):
    title: str = Field(alias="name")
    release_date: TmdbDate = Field(alias="first_air_date")
    number_of_seasons: int | None = Field(alias="number_of_seasons", default=None)
    seasons: Sequence[TmdbSeason] | None = Field(alias="seasons", default=None)
    studios: Sequence[TmdbCompany] | None = Field(alias="networks", default=None)
    credits: TmdbCredits | None = Field(alias="credits", default=None)
