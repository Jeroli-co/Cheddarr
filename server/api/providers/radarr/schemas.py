from server.extensions import ma

from .models import RadarrConfig


class RadarrConfigSchema(ma.SQLAlchemySchema):
    class Meta:
        model = RadarrConfig

    host = ma.auto_field()
    port = ma.auto_field()
    ssl = ma.auto_field()
    enabled = ma.auto_field()
    api_key = ma.auto_field()
    root_folder = ma.auto_field()
    quality_profile_id = ma.auto_field()
