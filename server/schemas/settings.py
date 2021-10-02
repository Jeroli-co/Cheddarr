from typing import Optional

from server.models.settings import MediaProviderType
from .core import APIModel


class ExternalServiceSettingBase(APIModel):
    host: str
    port: Optional[int]
    ssl: bool
    api_key: str
    name: Optional[str]
    enabled: Optional[bool] = True
    version: Optional[int]


class MediaServerSettingBase(ExternalServiceSettingBase):
    server_id: str
    server_name: str


class MediaProviderSettingBase(ExternalServiceSettingBase):
    provider_type: Optional[MediaProviderType]
    root_folder: str
    quality_profile_id: int
    version: int
    is_default: Optional[bool] = False


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
    quality_profiles: list[dict]
    version: int


class RadarrSettingSchema(MediaProviderSettingBase):
    id: str


class RadarrSettingCreateUpdate(MediaProviderSettingBase):
    ...


#####################################
# Sonarr                            #
#####################################


class SonarrInstanceInfo(APIModel):
    root_folders: list[str]
    quality_profiles: list[dict]
    language_profiles: Optional[list[dict]]
    version: int


class SonarrSettingSchema(MediaProviderSettingBase):
    id: str
    anime_root_folder: Optional[str]
    anime_quality_profile_id: Optional[int]
    language_profile_id: Optional[int]
    anime_language_profile_id: Optional[int]


class SonarrSettingCreateUpdate(MediaProviderSettingBase):
    anime_root_folder: Optional[str]
    anime_quality_profile_id: Optional[int]
    language_profile_id: Optional[int]
    anime_language_profile_id: Optional[int]
