from marshmallow import pre_dump
from marshmallow.validate import OneOf

from server.extensions import ma
from server.models import ProviderType


class ProviderConfigSchema(ma.Schema):

    id = ma.UUID()
    name = ma.String(dump_only=True)
    enabled = ma.Boolean()
    provider_type = ma.String(
        validate=OneOf(
            [
                ProviderType.MEDIA_SERVER.value,
                ProviderType.SERIES_PROVIDER.value,
                ProviderType.MOVIE_PROVIDER.value,
            ]
        )
    )

    @pre_dump
    def provider_type_values(self, config, **kwargs):
        config.provider_type = config.provider_type.value
        return config
