from server.extensions import ma
from server.providers.models import PlexConfig
from server.providers.models.provider_config import RadarrConfig


class PlexConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexConfig
        exclude = ("id", "provider_name", "plex_user_id")


class RadarrConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RadarrConfig
        exclude = ("id",)


plex_config_serializer = PlexConfigSerializer()
provider_status_serializer = PlexConfigSerializer(only=["enabled"])
radarr_config_serializer = RadarrConfigSerializer()
