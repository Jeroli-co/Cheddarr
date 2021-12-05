from datetime import date, datetime
from typing import Optional
from urllib.parse import quote

from pydantic import AnyHttpUrl, Field, validator

from .core import APIModel


#####################################
# Media Servers                     #
#####################################


class MediaServerInfo(APIModel):
    external_id: str
    added_at: date
    server_id: str
    web_url: Optional[AnyHttpUrl]


class PlexMediaInfo(MediaServerInfo):
    @validator("web_url", pre=True, always=True)
    def get_web_url(cls, web_url, values):
        media_key = quote(f"/library/metadata/{values['external_id']}", safe="")
        return (
            f"https://app.plex.tv/desktop#!/server/{values['server_id']}/details?key={media_key}"
        )


#####################################
# Media Providers                   #
#####################################


class RadarrAddOptions(APIModel):
    search_for_movie: bool = Field(alias="searchForMovie")


class RadarrMovie(APIModel):
    id: Optional[int]
    tmdb_id: int = Field(alias="tmdbId")
    title: str = Field(alias="title")
    title_slug: str = Field(alias="titleSlug")
    year: int = Field(alias="year")
    quality_profile_id: Optional[int] = Field(alias="qualityProfileId")
    root_folder_path: Optional[str] = Field(alias="rootFolderPath")
    monitored: bool = Field(alias="monitored")
    images: list[dict] = Field(alias="images")
    has_file: bool = Field(alias="hasFile")
    add_options: Optional[RadarrAddOptions] = Field(alias="addOptions")


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
    episode_file_count: Optional[int] = Field(alias="episodeFileCount")
    total_episode_count: Optional[int] = Field(alias="totalEpisodeCount")


class SonarrSeries(APIModel):
    id: Optional[int] = Field(alias="id")
    tvdb_id: int = Field(alias="tvdbId")
    title: str = Field(alias="title")
    images: list[dict] = Field(alias="images")
    seasons: list[SonarrSeason] = Field(alias="seasons")
    year: int = Field(alias="year")
    path: Optional[str] = Field(alias="path")
    profile_id: Optional[int] = Field(alias="profileId")
    root_folder_path: Optional[str] = Field(alias="rootFolderPath")
    quality_profile_id: Optional[int] = Field(alias="qualityProfileId")
    language_profile_id: Optional[int] = Field(alias="languageProfileId")
    monitored: bool = Field(alias="monitored")
    series_type: str = Field(alias="seriesType")
    title_slug: str = Field(alias="titleSlug")
    genres: list[str] = Field(alias="genres")
    tags: list[str] = Field(alias="tags")
    added: datetime = Field(alias="added")
    episode_file_count: Optional[int] = Field(alias="episodeFileCount")
    total_episode_count: Optional[int] = Field(alias="totalEpisodeCount")
    add_options: Optional[SonarrAddOptions] = Field(alias="addOptions")
