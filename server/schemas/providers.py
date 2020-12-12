from datetime import date
from typing import Optional

from pydantic import AnyHttpUrl, Field, validator

from server.schemas import APIModel
from server.models import ProviderType


class ProviderConfigBase(APIModel):
    host: str
    port: Optional[int]
    ssl: bool
    api_key: str


#####################################
# Plex                              #
#####################################
class PlexServerInfo(APIModel):
    server_id: str
    server_name: str


class PlexConfig(ProviderConfigBase, PlexServerInfo):
    id: str
    name: str
    enabled: bool = True
    provider_type: ProviderType = Field(default=ProviderType.media_server, const=True)


class PlexConfigCreateUpdate(ProviderConfigBase, PlexServerInfo):
    enabled: Optional[bool] = True


#####################################
# Radarr                            #
#####################################
class RadarrInstanceInfo(APIModel):
    root_folders: list[str]
    quality_profiles: list[dict]
    version: int


class RadarrConfigData(APIModel):
    root_folder: str
    quality_profile_id: int
    version: int = Field(ge=2, le=3)


class RadarrConfig(ProviderConfigBase, RadarrConfigData):
    id: str
    name: str
    enabled: bool = True
    provider_type: ProviderType = Field(default=ProviderType.movie_provider, const=True)


class RadarrConfigCreateUpdate(ProviderConfigBase, RadarrConfigData):
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
    images: list[dict] = Field(alias="images")
    add_options: Optional[RadarrAddOptions] = Field(alias="addOptions")


#####################################
# Sonarr                            #
#####################################
class SonarrInstanceInfo(APIModel):
    root_folders: list[str]
    quality_profiles: list[dict]
    language_profiles: list[dict]
    version: int


class SonarrConfigData(APIModel):
    root_folder: str
    anime_root_folder: Optional[str]
    quality_profile_id: int
    anime_quality_profile_id: Optional[int]
    language_profile_id: Optional[int]
    anime_language_profile_id: Optional[int]
    version: int = Field(ge=2, le=3)


class SonarrConfig(ProviderConfigBase, SonarrConfigData):
    id: str
    name: str
    enabled: bool = True
    provider_type: ProviderType = Field(
        default=ProviderType.series_provider, const=True
    )


class SonarrConfigCreateUpdate(ProviderConfigBase, SonarrConfigData):
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


class SonarrSeason(APIModel):
    season_number: int = Field(alias="seasonNumber")
    monitored: bool = Field(alias="monitored")


class SonarrSeries(APIModel):
    id: Optional[int]
    title: str = Field(alias="title")
    tvdb_id: int = Field(alias="tvdbId")
    title_slug: str = Field(alias="titleSlug")
    quality_profile_id: Optional[int] = Field(alias="qualityProfileId")
    language_profile_id: Optional[int] = Field(alias="languageProfileId")
    root_folder_path: Optional[str] = Field(alias="rootFolderPath")
    images: list[dict] = Field(alias="images")
    add_options: Optional[SonarrAddOptions] = Field(alias="addOptions")
    series_type: str
    seasons: list[SonarrSeason]


#####################################
# PlexAPI                           #
#####################################
class PlexServerIn(APIModel):
    base_url: str = Field(alias="_baseurl")
    api_key: str = Field(alias="_token")
    server_id: str = Field(alias="machineIdentifier")
    server_name: str = Field(alias="friendlyName")


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
    web_url: Optional[AnyHttpUrl] = Field(
        default_factory=lambda media: "%s/web/index.html#!/server/%s/details?key=%s"
        % (
            media._server._baseurl,
            media._server.machineIdentifier,
            media.key,
        ),
        const=True,
    )


class PlexMovie(PlexVideo):
    duration: int
    release_date: date = Field(alias="originallyAvailableAt")
    actors: list[PlexMediaTag]
    directors: list[PlexMediaTag]
    studio: str
    genres: list[PlexMediaTag]


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
    episodes: list[PlexEpisode]

    @validator("episodes", pre=True)
    def get_episodes(cls, episodes, **kwargs):
        return episodes()


class PlexSeries(PlexVideo):
    seasons: list[PlexSeason]
    actors: list[PlexMediaTag]
    studio: str
    genres: list[PlexMediaTag]
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
