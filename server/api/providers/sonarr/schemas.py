from server.api.providers.sonarr.models import SonarrConfig
from server.extensions import ma


class SonarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            SonarrConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance
        exclude = ("id", "provider_type")
