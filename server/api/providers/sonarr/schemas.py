from server.extensions import ma

from .models import SonarrConfig


class SonarrConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            SonarrConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance
        exclude = ("provider_type",)
