from enum import Enum, auto

from server.database import Boolean, Column
from server.database import Enum as DBEnum
from server.database import ForeignKey, Integer, String, relationship, session
from server.database.model import Model
from sqlalchemy.ext.declarative import AbstractConcreteBase, declared_attr


class ProviderType(str, Enum):
    MEDIA_SERVER = auto()
    MOVIE_REQUEST = auto()
    SERIES_REQUEST = auto()


class ProviderConfig(Model, AbstractConcreteBase):
    __abstract__ = True

    __repr_props__ = ("enabled", "provider_type")

    id = Column(Integer, primary_key=True)
    api_key = Column(String(256), unique=True)
    enabled = Column(Boolean, default=False)
    provider_type = Column(DBEnum(ProviderType))

    @declared_attr
    def __mapper_args__(cls):
        if cls == ProviderConfig:
            return {"concrete": False}
        return {"polymorphic_identity": cls.__name__, "concrete": True}

    @declared_attr
    def user(cls):
        return relationship("User")

    @declared_attr
    def user_id(cls):
        return Column(Integer, ForeignKey("user.id"), nullable=False)

    def update(self, updated_config):
        for config, value in updated_config.items():
            setattr(self, config, value)
        session.add(self)
        return session.commit()


# Sub-models
from .plex import models  # noqa
from .radarr import models  # noqa
from .sonarr import models  # noqa
