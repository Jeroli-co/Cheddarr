from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class SonarrAddOptions(BaseModel):
    ignore_episodes_with_files: bool = Field(alias="ignoreEpisodesWithFiles")
    ignore_episodes_without_files: bool = Field(alias="ignoreEpisodesWithoutFiles")
    search_for_missing_episodes: bool = Field(alias="searchForMissingEpisodes")


class SonarrEpisode(BaseModel):
    id: int = Field(alias="id")
    episode_number: int = Field(alias="episodeNumber")
    season_number: int = Field(alias="seasonNumber")
    monitored: bool = Field(alias="monitored")
    has_file: bool = Field(alias="hasFile")


class SonarrSeason(BaseModel):
    season_number: int = Field(alias="seasonNumber")
    monitored: bool = Field(alias="monitored")
    episode_file_count: int | None = Field(None, alias="episodeFileCount")
    total_episode_count: int | None = Field(None, alias="totalEpisodeCount")


class SonarrSeries(BaseModel):
    id: int | None = Field(None, alias="id")
    tvdb_id: int = Field(alias="tvdbId")
    title: str = Field(alias="title")
    images: list[dict[str, str]] = Field(alias="images")
    seasons: list[SonarrSeason] = Field(alias="seasons")
    year: int = Field(alias="year")
    path: str | None = Field(None, alias="path")
    profile_id: int | None = Field(None, alias="profileId")
    root_folder_path: str | None = Field(None, alias="rootFolderPath")
    quality_profile_id: int | None = Field(None, alias="qualityProfileId")
    monitored: bool = Field(alias="monitored")
    series_type: str = Field(alias="seriesType")
    title_slug: str = Field(alias="titleSlug")
    genres: list[str] = Field(alias="genres")
    tags: list[int] = Field(alias="tags")
    added: datetime = Field(alias="added")
    episode_file_count: int | None = Field(None, alias="episodeFileCount")
    total_episode_count: int | None = Field(None, alias="totalEpisodeCount")
    add_options: SonarrAddOptions | None = Field(None, alias="addOptions")
