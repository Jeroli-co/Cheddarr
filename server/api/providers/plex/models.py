from server.api.providers.models import ProviderConfig, ProviderType
from server.database import Column, ForeignKey, Integer, Model, String, relationship


class PlexServer(Model):

    __repr_props__ = ("mahcine_id", "name")

    machine_id = Column(String(64), primary_key=True)
    name = Column(String(64))
    plex_config_id = Column(Integer, ForeignKey("plexconfig.id"))


class PlexConfig(ProviderConfig):

    __repr_props__ = ("servers",)

    plex_user_id = Column(Integer)
    servers = relationship(PlexServer, backref="plex_config", cascade="all")

    def __init__(self, plex_user_id, api_key):
        self.plex_user_id = plex_user_id
        self.api_key = api_key
        self.provider_type = ProviderType.MEDIA_SERVER
        self.enabled = True
