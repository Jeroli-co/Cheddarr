from server.extensions import db
from sqlalchemy.orm import with_polymorphic


class ProviderConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_name = db.Column(db.String(32), nullable=False)
    provider_api_key = db.Column(db.String(256), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    enabled = db.Column(db.Boolean, default=False, nullable=False)
    __mapper_args__ = {
        "polymorphic_on": provider_name,
    }

    def __repr__(self):
        return "%s/%s/%s" % (self.provider_name, self.provider_api_key, self.enabled)

    def update(self, updated_config):
        for config, value in updated_config.items():
            if value != "":
                setattr(self, config, value)
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find(cls, user):
        return cls.query.filter_by(user_id=user.id).one()


class PlexConfig(ProviderConfig):
    id = db.Column(db.Integer, db.ForeignKey("provider_config.id"), primary_key=True)
    plex_user_id = db.Column(db.Integer, unique=True, nullable=False)
    machine_id = db.Column(db.String(64))
    machine_name = db.Column(db.String(64))

    __mapper_args__ = {"polymorphic_identity": "plex"}

    def __repr__(self):
        return "%s/%s" % (super().__repr__(), self.machine_name)


class RadarrConfig(ProviderConfig):
    id = db.Column(db.Integer, db.ForeignKey("provider_config.id"), primary_key=True)
    host = db.Column(db.String(128))
    port = db.Column(db.String(5))
    ssl = db.Column(db.Boolean())

    __mapper_args__ = {"polymorphic_identity": "radarr"}

    def __repr__(self):
        return "%s/%s/%s/%s" % (super().__repr__(), self.host, self.port, self.ssl)
