from sqlalchemy import Boolean, Column, Integer, String

from .base import ProviderConfig


class RadarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)
    root_folder = Column(String(128))
    quality_profile_id = Column(Integer)
    version = Column(Integer)

    __repr_props__ = (
        *ProviderConfig.__repr_props__,
        "host",
        "port",
        "ssl",
    )
