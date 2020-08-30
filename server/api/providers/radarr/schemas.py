from server.extensions import ma
from server.api.providers.radarr.models import RadarrConfig


class RadarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RadarrConfig
        exclude = ("id", "name", "type")
