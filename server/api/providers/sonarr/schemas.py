from server.extensions import ma

from .models import SonarrConfig


class SonarrConfigSchema(ma.SQLAlchemySchema):
    class Meta:
        model = SonarrConfig

    host = ma.auto_field()
    port = ma.auto_field()
    ssl = ma.auto_field()
    enabled = ma.auto_field()
    api_key = ma.auto_field()
    root_folder = ma.auto_field()
    anime_root_folder = ma.auto_field()
