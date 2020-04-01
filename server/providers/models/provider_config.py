from server import db


class ProviderConfig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    provider_name = db.Column(db.String(32), nullable=False)
    provider_api_key = db.Column(db.String(256), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    enabled = db.Column(db.Boolean, default=False, nullable=False)
    __mapper_args__ = {
        "polymorphic_on": provider_name,
    }


class PlexConfig(ProviderConfig):
    id = db.Column(db.Integer, db.ForeignKey("provider_config.id"), primary_key=True)
    plex_user_id = db.Column(db.Integer, unique=True, nullable=False)
    machine_id = db.Column(db.Integer)

    __mapper_args__ = {"polymorphic_identity": "plex"}
