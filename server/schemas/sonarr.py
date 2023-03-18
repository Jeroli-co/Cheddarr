from datetime import datetime

from pydantic import Field

from server.schemas.base import APIModel


class SonarrAddOptions(APIModel):
    ignore_episodes_with_files: bool = Field(alias="ignoreEpisodesWithFiles")
    ignore_episodes_without_files: bool = Field(alias="ignoreEpisodesWithoutFiles")
    search_for_missing_episodes: bool = Field(alias="searchForMissingEpisodes")


class SonarrEpisode(APIModel):
    id: int
    episode_number: int = Field(alias="episodeNumber")
    season_number: int = Field(alias="seasonNumber")
    monitored: bool = Field(alias="monitored")
    has_file: bool = Field(alias="hasFile")


class SonarrSeason(APIModel):
    season_number: int = Field(alias="seasonNumber")
    monitored: bool = Field(alias="monitored")
    episode_file_count: int | None = Field(alias="episodeFileCount")
    total_episode_count: int | None = Field(alias="totalEpisodeCount")


class SonarrSeries(APIModel):
    id: int | None = Field(alias="id")
    tvdb_id: int = Field(alias="tvdbId")
    title: str = Field(alias="title")
    images: list[dict[str, str]] = Field(alias="images")
    seasons: list[SonarrSeason] = Field(alias="seasons")
    year: int = Field(alias="year")
    path: str | None = Field(alias="path")
    profile_id: int | None = Field(alias="profileId")
    root_folder_path: str | None = Field(alias="rootFolderPath")
    quality_profile_id: int | None = Field(alias="qualityProfileId")
    language_profile_id: int | None = Field(alias="languageProfileId")
    monitored: bool = Field(alias="monitored")
    series_type: str = Field(alias="seriesType")
    title_slug: str = Field(alias="titleSlug")
    genres: list[str] = Field(alias="genres")
    tags: list[str] = Field(alias="tags")
    added: datetime = Field(alias="added")
    episode_file_count: int | None = Field(alias="episodeFileCount")
    total_episode_count: int | None = Field(alias="totalEpisodeCount")
    add_options: SonarrAddOptions | None = Field(alias="addOptions")
