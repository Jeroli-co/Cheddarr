from server.models import (
    PlexSetting,
    ProviderSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.repositories.base import BaseRepository


class ProviderSettingRepository(BaseRepository[ProviderSetting]):
    pass


class PlexSettingRepository(BaseRepository[PlexSetting]):
    pass


class RadarrSettingRepository(BaseRepository[RadarrSetting]):
    pass


class SonarrSettingRepository(BaseRepository[SonarrSetting]):
    pass
