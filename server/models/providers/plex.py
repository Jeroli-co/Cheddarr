from __future__ import annotations
from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship, Session
from sqlalchemy_utils import UUIDType

from server.database import Model
from .base import ProviderConfig
from .. import ProviderType

if TYPE_CHECKING:
    from server.schemas import (
        PlexConfigCreate,
        PlexConfigUpdate,
        PlexServer as PlexServerSchema,
    )  # noqa


class PlexServer(Model["PlexServer", "PlexServerSchema", None]):

    machine_id = Column(String, primary_key=True)
    name = Column(String)
    configs = relationship(
        "PlexConfig", secondary="plexconfigserver", back_populates="servers"
    )
    __repr_props__ = ("machine_id", "name")

    def __eq__(self, other):
        return self.machine_id == other.machine_id


class PlexConfig(
    Model["PlexConfig", "PlexConfigCreate", "PlexConfigUpdate"], ProviderConfig
):

    plex_user_id = Column(Integer)
    servers = relationship(
        "PlexServer", secondary="plexconfigserver", back_populates="configs"
    )

    __repr_props__ = (
        *ProviderConfig.__repr_props__,
        "user",
        "servers",
    )

    @classmethod
    def create(
        cls, db: Session, obj_in: PlexConfigCreate, commit: bool = True
    ) -> PlexConfig:
        config = super().create(db, obj_in=obj_in, commit=False)
        config.update(db, obj_in=dict(provider_type=ProviderType.media_server))
        return config


plex_configs_servers = Table(
    "plexconfigserver",
    Model.metadata,
    Column("config_id", UUIDType(binary=False), ForeignKey("plexconfig.id")),
    Column("server_id", String, ForeignKey("plexserver.machine_id")),
)
