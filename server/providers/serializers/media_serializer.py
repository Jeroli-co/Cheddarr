from marshmallow import fields, post_load

from server.extensions import ma
from server.providers.models.media import Movie


class PlexMovieSerializer(ma.Schema):
    title = fields.Str(data_key="title")
    thumbUrl = fields.URL(data_key="poster")

    @post_load
    def make_movie(self, data, **kwargs):
        return Movie(**data)


plex_movie_serializer = PlexMovieSerializer()
