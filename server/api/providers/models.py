from enum import Enum, auto
from uuid import uuid4

from sqlalchemy.ext.declarative import AbstractConcreteBase, declared_attr

from server.database import (
    Enum as DBEnum,
    ForeignKey,
    Model,
    String,
    Boolean,
    Column,
    relationship,
    UUID,
)


class ProviderType(str, Enum):
    MEDIA_SERVER = auto()
    MOVIE_PROVIDER = auto()
    SERIES_PROVIDER = auto()


class ProviderConfig(Model, AbstractConcreteBase):

    __repr_props__ = ("enabled", "provider_type")

    id = Column(UUID(binary=False), default=uuid4, primary_key=True)
    api_key = Column(String(256))
    enabled = Column(Boolean, default=False)
    provider_type = Column(DBEnum(ProviderType))

    @declared_attr
    def __mapper_args__(cls):
        if cls == ProviderConfig:
            return {"concrete": False}
        return {"polymorphic_identity": cls.__name__, "concrete": True}

    @declared_attr
    def user(cls):
        return relationship("User", back_populates="providers")

    @declared_attr
    def user_id(cls):
        return Column(ForeignKey("user.id"), nullable=False)

    def provides_movies(self):
        return self.provider_type == ProviderType.MOVIE_PROVIDER

    def provides_series(self):
        return self.provider_type == ProviderType.SERIES_PROVIDER


# Sub-models
from .plex import models  # noqa
from .radarr import models  # noqa
from .sonarr import models  # noqa
