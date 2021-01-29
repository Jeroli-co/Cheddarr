from server.models import (
    PlexConfig,
    RadarrConfig,
    SonarrConfig,
)
from server.repositories.base import BaseRepository


class PlexConfigRepository(BaseRepository[PlexConfig]):
    pass


class RadarrConfigRepository(BaseRepository[RadarrConfig]):
    pass


class SonarrConfigRepository(BaseRepository[SonarrConfig]):
    pass
