from server.database import Boolean, Column, String, Integer, relationship
from .base import ProviderConfig, ProviderType


class SonarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)
    root_folder = Column(String(128))
    anime_root_folder = Column(String(128), nullable=True)
    quality_profile_id = Column(Integer)
    anime_quality_profile_id = Column(Integer, nullable=True)
    language_profile_id = Column(Integer, nullable=True)
    anime_language_profile_id = Column(Integer, nullable=True)
    version = Column(Integer)
    series_requests = relationship(
        "SeriesChildRequest",
        primaryjoin="SeriesChildRequest.selected_provider_id==SonarrConfig.id",
        foreign_keys="SeriesChildRequest.selected_provider_id",
        backref="selected_provider",
    )
    __repr_props__ = (
        "id",
        "host",
        "port",
        "ssl",
        "version",
        "enabled",
    )

    def __init__(self, **kwargs):
        self.provider_type = ProviderType.SERIES_PROVIDER
        for field, value in kwargs.items():
            if hasattr(self, field):
                setattr(self, field, value)
