from datetime import date, datetime
from typing import List, Optional

from pydantic import AnyHttpUrl, Field, validator

from server.schemas import APIModel


#####################################
# Plex                              #
#####################################


class PlexMediaInfo(APIModel):
    external_media_id: str
    added_at: date
    server_id: str
    web_url: Optional[AnyHttpUrl]

    @validator("web_url", pre=True)
    def get_web_url(cls, web_url, values):
        print(values)
        return "https://app.plex.tv/web/app#!/server/%s/details?key=library/metadata/%s" % (
            values["server_id"],
            values["external_media_id"],
        )


#####################################
# Radarr                            #
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
    images: List[dict] = Field(alias="images")
    has_file: bool = Field(alias="hasFile")
    add_options: Optional[RadarrAddOptions] = Field(alias="addOptions")


#####################################
# Sonarr                            #
#####################################


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
    images: List[dict] = Field(alias="images")
    seasons: List[SonarrSeason] = Field(alias="seasons")
    year: int = Field(alias="year")
    path: Optional[str] = Field(alias="path")
    profile_id: Optional[int] = Field(alias="profileId")
    root_folder_path: Optional[str] = Field(alias="rootFolderPath")
    quality_profile_id: Optional[int] = Field(alias="qualityProfileId")
    language_profile_id: Optional[int] = Field(alias="languageProfileId")
    monitored: bool = Field(alias="monitored")
    series_type: str = Field(alias="seriesType")
    title_slug: str = Field(alias="titleSlug")
    genres: List[str] = Field(alias="genres")
    tags: List[str] = Field(alias="tags")
    added: datetime = Field(alias="added")
    episode_file_count: Optional[int] = Field(alias="episodeFileCount")
    total_episode_count: Optional[int] = Field(alias="totalEpisodeCount")
    add_options: Optional[SonarrAddOptions] = Field(alias="addOptions")
