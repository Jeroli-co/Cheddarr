from marshmallow import post_load

from server.extensions import ma
from server.models import RadarrConfig


class RadarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            RadarrConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance
        exclude = ("provider_type",)

    @post_load
    def make_config(self, data, **kwargs):
        return RadarrConfig(**data)
