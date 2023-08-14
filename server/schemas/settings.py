from __future__ import annotations

from abc import ABC
from typing import Any

from server.models.settings import MediaProviderType
from server.schemas.base import APIModel


class ExternalServiceSettingBase(APIModel, ABC):
    host: str
    port: int | None = None
    ssl: bool
    api_key: str
    name: str | None = None
    enabled: bool | None = True
    version: int | None = None


class MediaServerSettingBase(ExternalServiceSettingBase, ABC):
    server_id: str
    server_name: str


class MediaProviderSettingBase(ExternalServiceSettingBase, ABC):
    provider_type: MediaProviderType | None = None
    root_folder: str
    quality_profile_id: int
    version: int
    is_default: bool | None = False
    tags: list[str] | None = None


#####################################
# Plex                              #
#####################################


class PlexServer(MediaServerSettingBase):
    local: bool


class PlexLibrarySection(APIModel):
    library_id: str
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
    version: int | None = None
    tags: list[dict[str, Any]]


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
    version: int | None = None
    tags: list[dict[str, Any]]


class SonarrSettingSchema(MediaProviderSettingBase):
    id: str
    anime_root_folder: str | None = None
    anime_quality_profile_id: int | None = None
    anime_tags: list[str] | None = None


class SonarrSettingCreateUpdate(MediaProviderSettingBase):
    anime_root_folder: str | None = None
    anime_quality_profile_id: int | None = None
    anime_tags: list[str] | None = None
