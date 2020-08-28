from marshmallow import INCLUDE, pre_dump
from marshmallow.validate import OneOf

from server.auth.models import User
from server.extensions import ma


class SearchSchema(ma.Schema):
    class Meta:
        unknown = INCLUDE

    value = ma.String(required=True)
    type = ma.String(validate=OneOf(["movies", "series", "friends"]))


class MediaSearchResultSchema(ma.Schema):
    ratingKey = ma.String(data_key="id")
    title = ma.String()
    year = ma.Integer()
    thumbUrl = ma.String()
    type = ma.String()

    @pre_dump
    def media_type(self, media, **kwargs):
        media.type = media.type.replace("show", "series")
        return media


class FriendSearchResultSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    avatar = ma.auto_field()
    email = ma.auto_field()
    type = ma.Constant("friend")
