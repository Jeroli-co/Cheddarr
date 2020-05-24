from server.extensions import db
from server.providers.models import ProviderConfig, ProviderType


class PlexConfig(ProviderConfig):
    def __init__(self, plex_user_id, api_key):
        self.plex_user_id = plex_user_id
        self.api_key = api_key
        self.type = ProviderType.MEDIA_SERVER
        self.enabled = True

    id = db.Column(db.Integer, db.ForeignKey("provider_config.id"), primary_key=True)
    plex_user_id = db.Column(db.Integer, unique=True, nullable=False)
    machine_id = db.Column(db.String(64))
    machine_name = db.Column(db.String(64))

    __mapper_args__ = {"polymorphic_identity": "plex"}

    def __repr__(self):
        return "%s/%s" % (super().__repr__(), self.machine_name)
