from typing import List, Optional

from server.models.settings import MediaProviderType
from .core import APIModel
from .users import UserPublicSchema


class ExternalServiceSettingBase(APIModel):
    host: str
    port: Optional[int]
    ssl: bool
    api_key: str
    name: Optional[str]
    enabled: Optional[bool] = True


class MediaServerSettingBase(ExternalServiceSettingBase):
    server_id: str
    server_name: str


class MediaProviderSettingBase(ExternalServiceSettingBase):
    provider_type: Optional[MediaProviderType]
    root_folder: str
    quality_profile_id: int
    version: int
    is_default: bool = False


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
    users: List[UserPublicSchema] = []
    libraries: List[PlexLibrarySection] = []


class PlexSettingCreateUpdate(MediaServerSettingBase):
    enabled: Optional[bool] = True
    libraries: Optional[List[PlexLibrarySection]] = []


#####################################
# Radarr                            #
#####################################


class RadarrInstanceInfo(APIModel):
    root_folders: List[str]
    quality_profiles: List[dict]
    version: int


class RadarrSettingSchema(MediaProviderSettingBase):
    id: str


class RadarrSettingCreateUpdate(MediaProviderSettingBase):
    enabled: Optional[bool] = True
    is_default: Optional[bool] = False


#####################################
# Sonarr                            #
#####################################


class SonarrInstanceInfo(APIModel):
    root_folders: List[str]
    quality_profiles: List[dict]
    language_profiles: Optional[List[dict]]
    version: int


class SonarrSettingSchema(MediaProviderSettingBase):
    id: str
    anime_root_folder: Optional[str]
    anime_quality_profile_id: Optional[int]
    language_profile_id: Optional[int]
    anime_language_profile_id: Optional[int]


class SonarrSettingCreateUpdate(MediaProviderSettingBase):
    enabled: Optional[bool] = True
    is_default: Optional[bool] = False
    anime_root_folder: Optional[str]
    anime_quality_profile_id: Optional[int]
    language_profile_id: Optional[int]
    anime_language_profile_id: Optional[int]
