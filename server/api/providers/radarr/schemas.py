from server.api.providers.radarr.models import RadarrConfig
from server.extensions import ma


class RadarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            RadarrConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance
        exclude = ("id", "provider_type")
