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

    def update_config(self, config):
        self.query.filter_by(id=self.id).update(config)
        db.session.commit()

    @classmethod
    def get_api_key(cls, user):
        return (
            db.session.query(ProviderConfig.provider_api_key)
            .filter_by(user_id=user.id)
            .scalar()
        )


class PlexConfig(ProviderConfig):
    plex_user_id = db.Column(db.Integer, unique=True, nullable=False)
    machine_id = db.Column(db.String(64), unique=True)
    machine_name = db.Column(db.String(64), unique=True)

    __mapper_args__ = {"polymorphic_identity": "plex"}
