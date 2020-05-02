from server.extensions import ma
from server.providers.models import PlexConfig, SonarrConfig, RadarrConfig


class PlexConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexConfig
        exclude = ("id", "provider_name", "plex_user_id")


class SonarrConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SonarrConfig
        exclude = ("id",)


class RadarrConfigSerializer(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RadarrConfig
        exclude = ("id",)


plex_config_serializer = PlexConfigSerializer()
radarr_config_serializer = RadarrConfigSerializer()
sonarr_config_serializer = SonarrConfigSerializer()
