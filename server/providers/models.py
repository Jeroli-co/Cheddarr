from enum import auto, Enum

from server.extensions import db


class ProviderType(Enum):
    MEDIA_SERVER = auto()
    MOVIE_REQUEST = auto()
    SERIES_REQUEST = auto()


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
        return "%s/%s/%s/%s" % (self.name, self.api_key, self.enabled, self.type)

    def update(self, updated_config):
        for config, value in updated_config.items():
            setattr(self, config, value)
        db.session.add(self)
        return db.session.commit()

    def save(self):
        db.session.add(self)
        return db.session.commit()

    def delete(self):
        db.session.delete(self)
        return db.session.commit()

    @classmethod
    def find(cls, user):
        return cls.query.filter_by(user_id=user.id).one()


# Sub-models
from .plex import models  # noqa
from .radarr import models  # noqa
from .sonarr import models  # noqa
