from server.database import Boolean, Column, String, Integer
from .base import ProviderConfig, ProviderType


class RadarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)
    root_folder = Column(String(128))
    quality_profile_id = Column(Integer)
    version = Column(Integer)

    __repr_props__ = (
        "id",
        "host",
        "port",
        "ssl",
        "enabled",
    )

    def __init__(self, **kwargs):
        self.provider_type = ProviderType.MOVIE_PROVIDER
        for field, value in kwargs.items():
            if hasattr(self, field):
                setattr(self, field, value)
