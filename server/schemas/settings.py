from typing import Any

from server.models.settings import MediaProviderType
from server.schemas.base import APIModel


class ExternalServiceSettingBase(APIModel):
    host: str
    port: int | None
    ssl: bool
    api_key: str
    name: str | None
    enabled: bool | None = True
    version: int | None


class MediaServerSettingBase(ExternalServiceSettingBase):
    server_id: str
    server_name: str


class MediaProviderSettingBase(ExternalServiceSettingBase):
    provider_type: MediaProviderType | None
    root_folder: str
    quality_profile_id: int
    version: int
    is_default: bool | None = False


#####################################
# Plex                              #
#####################################


class PlexServer(MediaServerSettingBase):
    local: bool


class PlexLibrarySection(APIModel):
    library_id: int
    name: str
    enabled: bool = True


class PlexSettingSchema(MediaServerSettingBase):
    id: str


class PlexSettingCreateUpdate(MediaServerSettingBase):
    ...


#####################################
# Radarr                            #
#####################################


class RadarrInstanceInfo(APIModel):
    root_folders: list[str]
    quality_profiles: list[dict[str, Any]]
    version: int | None


class RadarrSettingSchema(MediaProviderSettingBase):
    id: str


class RadarrSettingCreateUpdate(MediaProviderSettingBase):
    ...


#####################################
# Sonarr                            #
#####################################


class SonarrInstanceInfo(APIModel):
    root_folders: list[str]
    quality_profiles: list[dict[str, Any]]
    language_profiles: list[dict[str, Any]] | None
    version: int | None


class SonarrSettingSchema(MediaProviderSettingBase):
    id: str
    anime_root_folder: str | None
    anime_quality_profile_id: int | None
    language_profile_id: int | None
    anime_language_profile_id: int | None


class SonarrSettingCreateUpdate(MediaProviderSettingBase):
    anime_root_folder: str | None
    anime_quality_profile_id: int | None
    language_profile_id: int | None
    anime_language_profile_id: int | None
