from marshmallow import fields, pre_dump

from server.auth.models import User
from server.extensions import ma


class MediaSearchResult(ma.Schema):
    ratingKey = fields.String(data_key="id")
    title = fields.String()
    year = fields.Integer()
    thumbUrl = fields.String()
    type = fields.String()

    @pre_dump
    def media_type(self, media, **kwargs):
        media.type = media.type.replace("show", "series")
        return media


media_search_serializer = MediaSearchResult(many=True)


class FriendSearchSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()
    email = ma.auto_field()
    type = fields.Constant("friend")


friends_search_serializer = FriendSearchSerializer(many=True)
