from server import ma
from server.providers.models import PlexConfig


class PlexConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexConfig
        exclude = ("id", "provider_name")


plex_serializer = PlexConfigSerializer()