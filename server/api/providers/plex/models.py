from server.api.providers.models import ProviderConfig, ProviderType
from server.database import (
    Column,
    ForeignKey,
    Integer,
    Model,
    String,
    Table,
    relationship,
)


class PlexServer(Model):

    __repr_props__ = ("mahcine_id", "name")

    machine_id = Column(Integer, primary_key=True)
    name = Column(String(64))


class PlexConfig(ProviderConfig):

    __repr_props__ = ("servers",)

    plex_user_id = Column(Integer)
    servers = relationship(
        "PlexServer", secondary="plexconfigserver", backref="configs"
    )

    def __init__(self, plex_user_id, api_key):
        self.plex_user_id = plex_user_id
        self.api_key = api_key
        self.provider_type = ProviderType.MEDIA_SERVER
        self.enabled = True


plex_configs_servers = Table(
    "plexconfigserver",
    Column("config_id", Integer, ForeignKey("plexconfig.id")),
    Column("server_id", Integer, ForeignKey("plexserver.machine_id")),
)
