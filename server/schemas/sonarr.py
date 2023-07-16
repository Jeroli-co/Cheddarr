from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class SonarrAddOptions(BaseModel):
    ignore_episodes_with_files: bool = Field(serialization_alias="ignoreEpisodesWithFiles")
    ignore_episodes_without_files: bool = Field(serialization_alias="ignoreEpisodesWithoutFiles")
    search_for_missing_episodes: bool = Field(serialization_alias="searchForMissingEpisodes")


class SonarrEpisode(BaseModel):
    id: int
    episode_number: int = Field(serialization_alias="episodeNumber")
    season_number: int = Field(serialization_alias="seasonNumber")
    monitored: bool = Field(serialization_alias="monitored")
    has_file: bool = Field(serialization_alias="hasFile")


class SonarrSeason(BaseModel):
    season_number: int = Field(serialization_alias="seasonNumber")
    monitored: bool = Field(serialization_alias="monitored")
    episode_file_count: int | None = Field(serialization_alias="episodeFileCount")
    total_episode_count: int | None = Field(serialization_alias="totalEpisodeCount")


class SonarrSeries(BaseModel):
    id: int | None = Field(serialization_alias="id")
    tvdb_id: int = Field(serialization_alias="tvdbId")
    title: str = Field(serialization_alias="title")
    images: list[dict[str, str]] = Field(serialization_alias="images")
    seasons: list[SonarrSeason] = Field(serialization_alias="seasons")
    year: int = Field(serialization_alias="year")
    path: str | None = Field(serialization_alias="path")
    profile_id: int | None = Field(serialization_alias="profileId")
    root_folder_path: str | None = Field(serialization_alias="rootFolderPath")
    quality_profile_id: int | None = Field(serialization_alias="qualityProfileId")
    monitored: bool = Field(serialization_alias="monitored")
    series_type: str = Field(serialization_alias="seriesType")
    title_slug: str = Field(serialization_alias="titleSlug")
    genres: list[str] = Field(serialization_alias="genres")
    tags: list[int] = Field(serialization_alias="tags")
    added: datetime = Field(serialization_alias="added")
    episode_file_count: int | None = Field(serialization_alias="episodeFileCount")
    total_episode_count: int | None = Field(serialization_alias="totalEpisodeCount")
    add_options: SonarrAddOptions | None = Field(serialization_alias="addOptions")
