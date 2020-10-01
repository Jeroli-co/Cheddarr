from server.database import (
    Column,
    ForeignKey,
    Integer,
    Model,
    String,
    Table,
    relationship,
)
from server.models.media_servers.base import MediaServer


class PlexServer(Model):

    __repr_props__ = ("machine_id", "name")

    machine_id = Column(String(128), primary_key=True)
    name = Column(String(128))


class PlexConfig(MediaServer):

    __repr_props__ = (
        "user",
        "servers",
    )
    plex_user_id = Column(Integer)
    servers = relationship(
        "PlexServer", secondary="plexconfigserver", backref="configs"
    )

    def __init__(self, plex_user_id, api_key):
        self.plex_user_id = plex_user_id
        self.api_key = api_key


plex_configs_servers = Table(
    "plexconfigserver",
    Column("config_id", ForeignKey("plexconfig.id")),
    Column("server_id", ForeignKey("plexserver.machine_id")),
)
