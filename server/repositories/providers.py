from server.models import (
    PlexSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.repositories.base import BaseRepository


class PlexSettingRepository(BaseRepository[PlexSetting]):
    pass


class RadarrSettingRepository(BaseRepository[RadarrSetting]):
    pass


class SonarrSettingRepository(BaseRepository[SonarrSetting]):
    pass
