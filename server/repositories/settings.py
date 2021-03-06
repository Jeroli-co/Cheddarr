from server.models.settings import (
    MediaProviderSetting,
    MediaServerSetting,
    PlexSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.repositories.base import BaseRepository


class MediaProviderSettingRepository(BaseRepository[MediaProviderSetting]):
    pass


class MediaServerSettingRepository(BaseRepository[MediaServerSetting]):
    pass


class PlexSettingRepository(BaseRepository[PlexSetting]):
    pass


class RadarrSettingRepository(BaseRepository[RadarrSetting]):
    pass


class SonarrSettingRepository(BaseRepository[SonarrSetting]):
    pass
