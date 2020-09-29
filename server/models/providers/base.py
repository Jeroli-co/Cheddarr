from enum import Enum
from typing import TYPE_CHECKING
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

if TYPE_CHECKING:
    from . import User  # noqa


class ProviderType(str, Enum):
    MEDIA_SERVER = "media_server"
    MOVIE_PROVIDER = "movie_provider"
    SERIES_PROVIDER = "series_provider"


class ProviderConfig(Model, AbstractConcreteBase):

    __repr_props__ = ("id", "name", "enabled", "provider_type")

    id = Column(UUID(binary=False), default=uuid4, primary_key=True)
    api_key = Column(String(256))
    enabled = Column(Boolean, default=False)
    provider_type = Column(
        DBEnum(
            ProviderType, values_callable=lambda types: [ptype.value for ptype in types]
        )
    )

    @declared_attr
    def __mapper_args__(cls):
        if cls == ProviderConfig:
            return {"concrete": False}
        return {"polymorphic_identity": cls.__name__, "concrete": True}

    @declared_attr
    def name(cls):
        return cls.__name__.replace("Config", "")

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