from server.extensions import db
from server.api.providers.models import ProviderConfig, ProviderType


class RadarrConfig(ProviderConfig):
    def __init__(self, api_key):
        self.api_key = api_key
        self.type = ProviderType.MOVIE_REQUEST

    id = db.Column(db.Integer, db.ForeignKey("provider_config.id"), primary_key=True)
    host = db.Column(db.String(128))
    port = db.Column(db.String(5))
    ssl = db.Column(db.Boolean())

    __mapper_args__ = {"polymorphic_identity": "radarr"}

    def __repr__(self):
        return "%s/%s/%s/%s/%s" % (
            super().__repr__(),
            self.name,
            self.host,
            self.port,
            self.ssl,
        )
