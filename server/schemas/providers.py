from datetime import date
from typing import List, Optional

from pydantic import AnyHttpUrl, Field, validator

from server.schemas import APIModel
from server.models import ProviderType


class ProviderConfigBase(APIModel):
    host: str
    port: int
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
    root_folders: List[str]
    quality_profiles: List[dict]
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


#####################################
# Sonarr                            #
#####################################
class SonarrInstanceInfo(APIModel):
    root_folders: List[str]
    quality_profiles: List[dict]
    language_profiles: List[dict]
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


"""
class MediaSearchResultSchema(APIModel):
    ratingKey = ma.String(data_key="id")
    title = ma.String()
    year = ma.Integer()
    thumbUrl = ma.String()
    type = ma.String()

    @post_dump
    def media_type(self, media, **kwargs):
        media["type"] = media.get("type").replace("show", "series")
        return media
"""
