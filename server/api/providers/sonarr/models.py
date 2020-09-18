from server.database import Boolean, Column, String, Integer

from ..models import ProviderConfig, ProviderType


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

    __repr_props__ = (
        "id",
        "host",
        "port",
        "ssl",
        "version",
        "enabled",
    )

    def __init__(self):
        self.provider_type = ProviderType.SERIES_REQUEST
