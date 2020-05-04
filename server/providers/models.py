from server.extensions import db
from enum import Enum, auto


class ProviderType(Enum):
    MEDIA_SERVER = auto()
    REQUESTS = auto()


class ProviderConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    api_key = db.Column(db.String(256), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    enabled = db.Column(db.Boolean, default=False, nullable=False)
    type = db.Column(db.Enum(ProviderType))
    __mapper_args__ = {
        "polymorphic_on": name,
    }

    def __repr__(self):
        return "%s/%s/%s" % (self.name, self.api_key, self.enabled)

    def update(self, updated_config):
        for config, value in updated_config.items():
            setattr(self, config, value)
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find(cls, user):
        return cls.query.filter_by(user_id=user.id).one()


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


class SonarrConfig(ProviderConfig):
    def __init__(self, api_key):
        self.api_key = api_key
        self.type = ProviderType.REQUESTS

    id = db.Column(db.Integer, db.ForeignKey("provider_config.id"), primary_key=True)
    host = db.Column(db.String(128))
    port = db.Column(db.String(5))
    ssl = db.Column(db.Boolean())

    __mapper_args__ = {"polymorphic_identity": "sonarr"}

    def __repr__(self):
        return "%s/%s/%s/%s/%s" % (
            super().__repr__(),
            self.name,
            self.host,
            self.port,
            self.ssl,
        )


class RadarrConfig(ProviderConfig):
    def __init__(self, api_key):
        self.api_key = api_key
        self.type = ProviderType.REQUESTS

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
