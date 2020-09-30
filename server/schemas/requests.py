from marshmallow import pre_dump, validates_schema, ValidationError
from marshmallow.validate import OneOf
from marshmallow_sqlalchemy import auto_field

from server.extensions import ma
from server.models import (
    SeriesRequest,
    SeriesChildRequest,
    SeasonRequest,
    EpisodeRequest,
    MovieRequest,
)
from server.models.requests import SeriesType


class MovieRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MovieRequest
        dump_only = ("requested_date", "response_date", "requested_user")

    requested_username = ma.String(load_only=True, required=True)
    requested_user = ma.Nested(
        "UserSchema",
        only=["username", "avatar"],
    )


class SeriesRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SeriesRequest

    children = ma.Nested("SeriesChildRequestSchema", many=True)


class SeriesChildRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SeriesChildRequest
        dump_only = ("requested_date", "response_date", "requested_user")

    seasons = ma.Nested("SeasonRequestSchema", many=True, required=True)
    tvdb_id = ma.Int(required=True)
    requested_user = ma.Nested(
        "UserSchema",
        only=["username", "avatar"],
    )
    requested_username = ma.String(load_only=True, required=True)
    series_type = ma.String(
        validate=OneOf([SeriesType.STANDARD, SeriesType.ANIME]),
        load_only=True,
        required=True,
    )
    selected_provider_id = auto_field()

    @pre_dump
    def get_dump_info(self, request, **kwargs):
        request.requested_user = request.series.requested_user
        request.tvdb_id = request.series.tvdb_id
        return request

    @validates_schema
    def validate_approve(self, data, **kwargs):
        if data.get("approved") and not data.get("selected_provider_id"):
            raise ValidationError(
                "Must have a value to approve a request.",
                field_name="selected_provier_id",
            )


class SeasonRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SeasonRequest
        load_instance = True

    episodes = ma.Nested("EpisodeRequestSchema", many=True)


class EpisodeRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EpisodeRequest
        load_instance = True
