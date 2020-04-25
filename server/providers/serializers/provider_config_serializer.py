from server.extensions import ma
from server.providers.models import PlexConfig


class PlexConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexConfig
        exclude = ("id", "provider_name", "plex_user_id")


plex_config_serializer = PlexConfigSerializer()
provider_status_serializer = PlexConfigSerializer(only=["enabled"])
