from typing import List, Optional

from pydantic import Field

from server.models import MediaProviderType, MediaType
from server.schemas import APIModel


class ProviderSettingBase(APIModel):
    host: str
    port: Optional[int]
    ssl: bool
    api_key: str
    name: Optional[str]


#####################################
# Plex                              #
#####################################


class PlexServerInfo(APIModel):
    server_id: str
    server_name: str


class PlexServer(ProviderSettingBase, PlexServerInfo):
    local: bool


class PlexLibrarySection(APIModel):
    id: int
    name: str
    type: MediaType
    enabled: bool = False


class PlexSetting(ProviderSettingBase, PlexServerInfo):
    id: str
    name: str
    enabled: bool = True
    library_sections: List[PlexLibrarySection]


class PlexSettingCreateUpdate(ProviderSettingBase, PlexServerInfo):
    enabled: Optional[bool] = True
    library_sections: Optional[List[PlexLibrarySection]] = []


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
    provider_type: MediaProviderType = Field(default=MediaProviderType.movie_provider, const=True)


class RadarrSettingCreateUpdate(ProviderSettingBase, RadarrSettingData):
    enabled: Optional[bool] = True


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
    provider_type: MediaProviderType = Field(default=MediaProviderType.series_provider, const=True)


class SonarrSettingCreateUpdate(ProviderSettingBase, SonarrSettingData):
    enabled: Optional[bool] = True
