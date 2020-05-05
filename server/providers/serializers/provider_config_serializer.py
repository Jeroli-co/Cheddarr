from server.extensions import ma
from server.providers.models import PlexConfig, SonarrConfig, RadarrConfig


class PlexConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexConfig
        exclude = ("id", "name", "api_key", "plex_user_id", "type")


class SonarrConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SonarrConfig
        exclude = ("id", "type")


class RadarrConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RadarrConfig
        exclude = ("id", "type")


plex_config_serializer = PlexConfigSerializer()
radarr_config_serializer = RadarrConfigSerializer()
sonarr_config_serializer = SonarrConfigSerializer()
