from pydantic import Field

from server.schemas.base import APIModel


class RadarrAddOptions(APIModel):
    search_for_movie: bool = Field(alias="searchForMovie")


class RadarrMovie(APIModel):
    id: int | None
    tmdb_id: int = Field(alias="tmdbId")
    title: str = Field(alias="title")
    title_slug: str = Field(alias="titleSlug")
    year: int = Field(alias="year")
    quality_profile_id: int | None = Field(alias="qualityProfileId")
    root_folder_path: str | None = Field(alias="rootFolderPath")
    monitored: bool = Field(alias="monitored")
    images: list[dict[str, str]] = Field(alias="images")
    has_file: bool = Field(alias="hasFile")
    add_options: RadarrAddOptions | None = Field(alias="addOptions")
