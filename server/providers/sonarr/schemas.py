from server.extensions import ma
from server.providers.sonarr.models import SonarrConfig


class SonarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SonarrConfig
        exclude = ("id", "name", "type")
