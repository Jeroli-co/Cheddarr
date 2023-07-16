from __future__ import annotations

from pydantic import BaseModel, Field


class RadarrAddOptions(BaseModel):
    search_for_movie: bool = Field(serialization_alias="searchForMovie")


class RadarrMovie(BaseModel):
    id: int | None = None
    tmdb_id: int = Field(serialization_alias="tmdbId")
    title: str = Field(serialization_alias="title")
    title_slug: str = Field(serialization_alias="titleSlug")
    year: int = Field(serialization_alias="year")
    quality_profile_id: int | None = Field(serialization_alias="qualityProfileId")
    root_folder_path: str | None = Field(serialization_alias="rootFolderPath")
    tags: list[int] = Field(serialization_alias="tags")
    monitored: bool = Field(serialization_alias="monitored")
    images: list[dict[str, str]] = Field(serialization_alias="images")
    has_file: bool = Field(serialization_alias="hasFile")
    add_options: RadarrAddOptions | None = Field(serialization_alias="addOptions")
