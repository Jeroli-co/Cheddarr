from datetime import date, datetime
from typing import Optional, List

from pydantic import AnyHttpUrl, Field, validator

from server.models import ProviderType
from server.schemas import APIModel


class ProviderSettingBase(APIModel):
    host: str
    port: Optional[int]
    ssl: bool
    api_key: str


#####################################
# Radarr                            #
#####################################
class RadarrInstanceInfo(APIModel):
    root_folders: List[str]
    quality_profiles: List[dict]
    version: int


class RadarrSettingData(APIModel):
    root_folder: str
    quality_profile_id: int
    version: int = Field(ge=2, le=3)


class RadarrSetting(ProviderSettingBase, RadarrSettingData):
    id: str
    name: str
    enabled: bool = True
    provider_type: ProviderType = Field(default=ProviderType.movie_provider, const=True)


class RadarrSettingCreateUpdate(ProviderSettingBase, RadarrSettingData):
    enabled: Optional[bool] = True


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
class SonarrInstanceInfo(APIModel):
    root_folders: List[str]
    quality_profiles: List[dict]
    language_profiles: Optional[List[dict]]
    version: int


class SonarrSettingData(APIModel):
    root_folder: str
    anime_root_folder: Optional[str]
    quality_profile_id: int
    anime_quality_profile_id: Optional[int]
    language_profile_id: Optional[int]
    anime_language_profile_id: Optional[int]
    version: int = Field(ge=2, le=3)


class SonarrSetting(ProviderSettingBase, SonarrSettingData):
    id: str
    name: str
    enabled: bool = True
    provider_type: ProviderType = Field(default=ProviderType.series_provider, const=True)


class SonarrSettingCreateUpdate(ProviderSettingBase, SonarrSettingData):
    enabled: Optional[bool] = True


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


#####################################
# Plex                              #
#####################################
class PlexServerInfo(APIModel):
    server_id: str
    server_name: str


class PlexSetting(ProviderSettingBase, PlexServerInfo):
    id: str
    name: str
    enabled: bool = True
    provider_type: ProviderType = Field(default=ProviderType.media_server, const=True)


class PlexSettingCreateUpdate(ProviderSettingBase, PlexServerInfo):
    enabled: Optional[bool] = True


#####################################
# PlexAPI                           #
#####################################
class PlexServerUrl(APIModel):
    base_url: str = Field(alias="_baseurl")
    server_id: str = Field(alias="machineIdentifier")


class PlexServerOut(APIModel):
    host: str
    port: int
    ssl: bool
    api_key: str
    server_id: str
    server_name: str


class PlexMediaTag(APIModel):
    name: str = Field(alias="tag")
    role: Optional[str]
    poster_url: Optional[AnyHttpUrl] = Field(alias="thumb")


class PlexVideo(APIModel):
    id: int = Field(alias="ratingKey")
    type: str = Field(alias="type")
    title: str = Field(alias="title")
    summary: str = Field(alias="summary")
    poster_url: Optional[AnyHttpUrl] = Field(alias="thumbUrl")
    art_url: Optional[AnyHttpUrl] = Field(alias="artUrl")
    rating: Optional[float] = Field(alias="audienceRating")
    is_watched: Optional[bool] = Field(alias="isWatched")
    server: PlexServerUrl = Field(alias="_server")
    web_url: Optional[AnyHttpUrl] = Field(alias="url")

    @validator("web_url", pre=True)
    def get_web_url(cls, web_url, values):
        return "%s/web/index.html#!/server/%s/details?key=%s" % (
            values["server"].base_url,
            values["server"].server_id,
            values["id"],
        )


class PlexMovie(PlexVideo):
    duration: int
    release_date: date = Field(alias="originallyAvailableAt")
    actors: List[PlexMediaTag]
    directors: List[PlexMediaTag]
    studio: str
    genres: List[PlexMediaTag]


class PlexEpisode(PlexVideo):
    series_id: int = Field(alias="grandparentRatingKey")
    series_title: str = Field(alias="grandparentTitle")
    season_number: int = Field(alias="seasonNumber")
    episode_number: int = Field(alias="index")
    release_date: date = Field(alias="originallyAvailableAt")
    season_poster_url: AnyHttpUrl = Field(
        alias="seasonThumbUrl",
        default_factory=lambda ep: ep.url(ep.parentThumb),
        const=True,
    )
    duration: int


class PlexSeason(PlexVideo):
    series_id: int = Field(alias="parentRatingKey")
    series_title: str = Field(alias="parentTitle")
    season_number: int = Field(alias="seasonNumber")
    episodes: List[PlexEpisode]

    @validator("episodes", pre=True)
    def get_episodes(cls, episodes, **kwargs):
        return episodes()


class PlexSeries(PlexVideo):
    seasons: List[PlexSeason]
    actors: List[PlexMediaTag]
    studio: str
    genres: List[PlexMediaTag]
    release_date: date = Field(alias="originallyAvailableAt")

    @validator("seasons", pre=True)
    def get_seasons(cls, seasons, **kwargs):
        return seasons()


class MediaSearchResultSchema(APIModel):
    id: int = Field(alias="ratingKey")
    type: str = Field(alias="type")
    title: str = Field(alias="title")
    year: int = Field(alias="year")
    poster_url: Optional[AnyHttpUrl] = Field(alias="thumbUrl")
