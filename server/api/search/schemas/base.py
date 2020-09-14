from marshmallow import post_dump
from marshmallow.validate import OneOf
from server.extensions import ma


class SearchSchema(ma.Schema):
    value = ma.String(required=True)
    type = ma.String(validate=OneOf(["movies", "series", "friends"]))
    page = ma.Int()


class MediaSearchResultSchema(ma.Schema):
    ratingKey = ma.String(data_key="id")
    title = ma.String()
    year = ma.Integer()
    thumbUrl = ma.String()
    type = ma.String()

    @post_dump
    def media_type(self, media, **kwargs):
        media["type"] = media.get("type").replace("show", "series")
        return media


class FriendSearchResultSchema(ma.Schema):
    username = ma.String()
    avatar = ma.URL()
    email = ma.Email()
    type = ma.Constant("friend")