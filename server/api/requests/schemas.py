from marshmallow import pre_dump

from server.extensions import ma
from .models import (
    SeriesRequest,
    SeriesChildRequest,
    SeasonRequest,
    EpisodeRequest,
    MovieRequest,
)


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
    tmdb_id = ma.Int(required=True)
    requested_user = ma.Nested(
        "UserSchema",
        only=["username", "avatar"],
    )
    requested_username = ma.String(load_only=True, required=True)

    @pre_dump
    def get_dump_info(self, request, **kwargs):
        request.requested_user = request.series.requested_user
        request.tmdb_id = request.series.tmdb_id
        return request


class SeasonRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SeasonRequest
        load_instance = True

    episodes = ma.Nested("EpisodeRequestSchema", many=True)


class EpisodeRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EpisodeRequest
        load_instance = True
