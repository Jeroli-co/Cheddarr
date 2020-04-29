from marshmallow import fields

from server.extensions import ma


class MediaSearchResult(ma.Schema):
    ratingKey = fields.String(data_key="id")
    title = fields.String()
    thumbUrl = fields.String()
    type = fields.String()


media_search_serializer = MediaSearchResult(many=True)
