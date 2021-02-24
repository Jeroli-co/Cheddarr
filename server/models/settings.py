from enum import Enum
from uuid import uuid4

from sqlalchemy import Boolean, Column, Enum as DBEnum, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.database import Model


class ExternalServiceType(str, Enum):
    movie_provider = "movies_provider"
    series_provider = "series_provider"
    media_server = "media_server"


class ExternalServiceSetting(Model):
    id = Column(String, default=lambda: uuid4().hex, primary_key=True)
    api_key = Column(String, nullable=False)
    host = Column(String, nullable=False)
    port = Column(Integer)
    ssl = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    service_type = Column(DBEnum(ExternalServiceType), nullable=False)
    service_name = Column(String)
    name = Column(String)
    user_id = Column(ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="external_settings")

    @declared_attr
    def __mapper_args__(cls):
        return {"polymorphic_identity": cls.__name__, "polymorphic_on": "service_name"}


class PlexSetting(ExternalServiceSetting):
    __repr_props__ = ("host", "port", "ssl", "server_name")

    id = Column(ForeignKey("externalservicesetting.id"), primary_key=True)
    server_id = Column(String, primary_key=True)
    server_name = Column(String)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = self.name or self.server_name
        self.service_type = ExternalServiceType.media_server


class RadarrSetting(ExternalServiceSetting):
    __repr_props__ = ("host", "port", "ssl", "version")

    id = Column(ForeignKey("externalservicesetting.id"), primary_key=True)
    root_folder = Column(String)
    quality_profile_id = Column(Integer)
    version = Column(Integer)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = self.name or self.service_name
        self.service_type = ExternalServiceType.movie_provider


class SonarrSetting(ExternalServiceSetting):
    __repr_props__ = ("host", "port", "ssl", "version")

    id = Column(ForeignKey("externalservicesetting.id"), primary_key=True)
    root_folder = Column(String(128))
    anime_root_folder = Column(String(128), nullable=True)
    quality_profile_id = Column(Integer)
    anime_quality_profile_id = Column(Integer, nullable=True)
    language_profile_id = Column(Integer, nullable=True)
    anime_language_profile_id = Column(Integer, nullable=True)
    version = Column(Integer)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = self.name or self.service_name
        self.service_type = ExternalServiceType.series_provider
