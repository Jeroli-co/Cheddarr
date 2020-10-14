from enum import Enum
from uuid import uuid4

from sqlalchemy import Boolean, Column, Enum as DBEnum, ForeignKey, String
from sqlalchemy.ext.declarative import AbstractConcreteBase, declared_attr
from sqlalchemy.orm import relationship
from sqlalchemy_utils import UUIDType

from server.database.base import Base


class ProviderType(str, Enum):
    movie_provider = "movie"
    series_provider = "series"
    media_server = "server"


class ProviderConfig(Base, AbstractConcreteBase):

    id = Column(UUIDType(binary=False), default=uuid4, primary_key=True)
    api_key = Column(String)
    enabled = Column(Boolean, default=True)
    provider_type = Column(DBEnum(ProviderType))

    __repr_props__ = ("id", "name", "enabled", "provider_type")

    @declared_attr
    def name(cls):
        return Column(String, default=cls.__name__.replace("Config", ""))

    @declared_attr
    def user_id(cls):
        return Column(ForeignKey("user.id"))

    @declared_attr
    def user(cls):
        return relationship("User", back_populates="providers")

    @declared_attr
    def __mapper_args__(cls):
        if cls == ProviderConfig:
            return {"concrete": False}
        return {"polymorphic_identity": cls.__name__, "concrete": True}
