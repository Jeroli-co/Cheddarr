from server.extensions import ma

from .models import RadarrConfig


class RadarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            RadarrConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance
        exclude = ("provider_type",)
