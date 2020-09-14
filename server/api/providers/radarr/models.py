from server.database import Boolean, Column, String

from ..models import ProviderConfig, ProviderType


class RadarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)
    root_folder = Column(String(128))

    __repr_props__ = ("id", "host", "port", "ssl", "enabled", "root_folder")

    def __init__(self):
        self.provider_type = ProviderType.MOVIE_REQUEST
