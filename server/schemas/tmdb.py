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
    also_known_as: list[str] | None = Field(None, alias="also_known_as")
    biography: str | None = Field(None, alias="biography")
    birth_day: TmdbDate = Field(None, alias="birthday")
    death_day: TmdbDate = Field(None, alias="deathday")
    credits: TmdbPersonCredits | None = Field(None, alias="credits")
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
    def get_video_url(cls, key: str, info: FieldValidationInfo) -> str:  # noqa: N805
        if info.data.get("site") == "YouTube" and info.data.get("type") == "Trailer":
            info.data["video_url"] = f"https://www.youtube.com/watch?v={key}"
        return key


class TmdbMedia(MediaSchemaBase, ABC):
    tmdb_id: int = Field(alias="id")
    tvdb_id: int | None = Field(None, validation_alias=AliasPath("external_ids", "tvdb_id"))
    imdb_id: str | None = Field(None, validation_alias=AliasPath("external_ids", "imdb_id"))
    external_ids: dict[str, Any] | None = Field({}, alias="external_ids")
    summary: str | None = Field(alias="overview")
    poster_url: TmdbPoster = Field(validation_alias=AliasChoices("poster_path", "still_path"))
    art_url: TmdbArt = Field(None, alias="backdrop_path")
    genres: Sequence[TmdbGenre] | None = Field(None, alias="genres")
    status: str | None = Field(None, alias="status")
    rating: float | None = Field(None, alias="vote_average")
    credits: TmdbCredits | None = Field(None, alias="credits")
    trailers: Sequence[TmdbVideo] | None = Field(None, validation_alias=AliasPath("videos", "results"))


class TmdbMovie(TmdbMedia, MovieSchema):
    title: str = Field(alias="title")
    release_date: TmdbDate = Field(alias="release_date")
    duration: int | None = Field(None, alias="runtime")
    studios: Sequence[TmdbCompany] | None = Field(None, alias="production_companies")


class TmdbEpisode(TmdbMedia, EpisodeSchema):
    title: str = Field(alias="name")
    episode_number: int = Field(alias="episode_number")
    release_date: TmdbDate = Field(alias="air_date")


class TmdbSeason(TmdbMedia, SeasonSchema):
    title: str = Field(alias="name")
    season_number: int = Field(alias="season_number")
    release_date: TmdbDate = Field(alias="air_date")
    episodes: Sequence[TmdbEpisode] | None = Field(None, alias="episodes")


class TmdbSeries(TmdbMedia, SeriesSchema):
    title: str = Field(alias="name")
    release_date: TmdbDate = Field(alias="first_air_date")
    number_of_seasons: int | None = Field(None, alias="number_of_seasons")
    seasons: Sequence[TmdbSeason] | None = Field(None, alias="seasons")
    studios: Sequence[TmdbCompany] | None = Field(None, alias="networks")
    credits: TmdbCredits | None = Field(None, alias="credits")
