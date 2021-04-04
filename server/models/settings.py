from enum import Enum
from uuid import uuid4

from sqlalchemy import Boolean, Column, Enum as DBEnum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from server.database import Model


class ExternalServiceName(str, Enum):
    plex = "Plex"
    radarr = "Radarr"
    sonarr = "Sonarr"


class ExternalServiceSetting(object):
    __mapper_args__ = {"polymorphic_on": "service_name"}

    def default_name(context):
        return context.get_current_parameters()["service_name"]

    id = Column(String, default=lambda: uuid4().hex, primary_key=True)
    api_key = Column(String, nullable=False)
    host = Column(String, nullable=False)
    port = Column(Integer)
    ssl = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    service_name = Column(String)
    name = Column(String, default=default_name)


class MediaServerSetting(Model, ExternalServiceSetting):
    server_id = Column(String, primary_key=True)
    server_name = Column(String)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="media_servers")
    libraries: list = relationship("MediaServerLibrary", cascade="all,delete,delete-orphan")


class MediaServerLibrary(Model):
    __repr_props__ = ("name",)

    id = Column(Integer, primary_key=True)
    library_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    setting_id = Column(ForeignKey("mediaserversetting.id"))


class PlexSetting(MediaServerSetting):
    __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": ExternalServiceName.plex}
    __repr_props__ = ("host", "port", "ssl", "server_name", "name")


class MediaProviderType(str, Enum):
    movie_provider = "movies_provider"
    series_provider = "series_provider"


class MediaProviderSetting(Model, ExternalServiceSetting):
    provider_type = Column(DBEnum(MediaProviderType), nullable=False)
    root_folder = Column(String, nullable=False)
    quality_profile_id = Column(Integer)
    language_profile_id = Column(Integer)
    version = Column(Integer)
    is_default = Column(Boolean, default=False)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="media_providers")


class RadarrSetting(MediaProviderSetting):
    __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": ExternalServiceName.radarr}
    __repr_props__ = ("host", "port", "ssl", "version", "name")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.provider_type = MediaProviderType.movie_provider


class SonarrSetting(MediaProviderSetting):
    __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": ExternalServiceName.sonarr}
    __repr_props__ = ("host", "port", "ssl", "version", "name")

    anime_root_folder = Column(String(128))
    anime_quality_profile_id = Column(Integer)
    anime_language_profile_id = Column(Integer)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.provider_type = MediaProviderType.series_provider
