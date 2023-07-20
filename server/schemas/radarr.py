from __future__ import annotations

from pydantic import BaseModel, Field


class RadarrAddOptions(BaseModel):
    search_for_movie: bool = Field(alias="searchForMovie")


class RadarrMovie(BaseModel):
    id: int | None = Field(None, alias="id")
    tmdb_id: int = Field(alias="tmdbId")
    title: str = Field(alias="title")
    title_slug: str = Field(alias="titleSlug")
    year: int = Field(alias="year")
    quality_profile_id: int | None = Field(None, alias="qualityProfileId")
    root_folder_path: str | None = Field(None, alias="rootFolderPath")
    tags: list[int] = Field(alias="tags")
    monitored: bool = Field(alias="monitored")
    images: list[dict[str, str]] = Field(alias="images")
    has_file: bool = Field(alias="hasFile")
    add_options: RadarrAddOptions | None = Field(None, alias="addOptions")
