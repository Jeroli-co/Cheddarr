from marshmallow import ValidationError, validates_schema

from server.extensions import ma
from .models import SonarrConfig


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
