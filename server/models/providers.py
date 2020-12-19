from enum import Enum
from uuid import uuid4

from sqlalchemy import Boolean, Column, Enum as DBEnum, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.database import Model


class ProviderType(str, Enum):
    movie_provider = "movies"
    series_provider = "series"
    media_server = "media_server"


class ProviderConfig(Model):
    id = Column(String, default=lambda: uuid4().hex, primary_key=True)
    api_key = Column(String, nullable=False)
    host = Column(String, nullable=False)
    port = Column(Integer)
    ssl = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    provider_type = Column(DBEnum(ProviderType), nullable=False)
    name = Column(String)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="providers")

    @declared_attr
    def __mapper_args__(cls):
        return {"polymorphic_identity": cls.__name__, "polymorphic_on": "name"}


class PlexConfig(ProviderConfig):
    __repr_props__ = ("host", "port", "ssl", "server_name")

    id = Column(ForeignKey("providerconfig.id"), primary_key=True)
    server_id = Column(String, primary_key=True)
    server_name = Column(String)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.provider_type = ProviderType.media_server


class RadarrConfig(ProviderConfig):
    __repr_props__ = ("host", "port", "ssl", "version")

    id = Column(ForeignKey("providerconfig.id"), primary_key=True)
    root_folder = Column(String)
    quality_profile_id = Column(Integer)
    version = Column(Integer)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.provider_type = ProviderType.movie_provider


class SonarrConfig(ProviderConfig):
    __repr_props__ = ("host", "port", "ssl", "version")

    id = Column(ForeignKey("providerconfig.id"), primary_key=True)
    root_folder = Column(String(128))
    anime_root_folder = Column(String(128), nullable=True)
    quality_profile_id = Column(Integer)
    anime_quality_profile_id = Column(Integer, nullable=True)
    language_profile_id = Column(Integer, nullable=True)
    anime_language_profile_id = Column(Integer, nullable=True)
    version = Column(Integer)
    """" series_requests = relationship(
        "SeriesChildRequest",
        primaryjoin="SeriesChildRequest.selected_provider_id==SonarrConfig.id",
        foreign_keys="SeriesChildRequest.selected_provider_id",
        backref="selected_provider",
    )"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.provider_type = ProviderType.series_provider
