from server.database import Boolean, Column, String

from ..models import ProviderConfig, ProviderType


class SonarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)
    root_folder = Column(String(128))
    anime_root_folder = Column(String(128), nullable=True)

    __repr_props__ = (
        "id",
        "host",
        "port",
        "ssl",
        "enabled",
        "root_folder",
        "anime_root_fodler",
    )

    def __init__(self):
        self.provider_type = ProviderType.SERIES_REQUEST
