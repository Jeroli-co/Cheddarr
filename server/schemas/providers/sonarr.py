from marshmallow import ValidationError, validates_schema, post_load
from marshmallow_dataclass import class_schema

from server.extensions import ma
from server.models import SonarrConfig
from server.models.providers.sonarr import SonarrSeries, SonarrEpisode


class SonarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            SonarrConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance
        exclude = ("provider_type",)

    @validates_schema
    def validate_v3(self, data, **kwargs):
        if data.get("version") == 3 and not data.get("language_profile_id"):
            raise ValidationError(
                "Must have a value in V3.",
                field_name="language_profile_id",
            )

    @post_load
    def make_config(self, data, **kwargs):
        return SonarrConfig(**data)


SonarrSeriesSchema = class_schema(SonarrSeries)
SonarrEpisodeSchema = class_schema(SonarrEpisode)
