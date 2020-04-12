from marshmallow import fields, post_dump, pre_dump

from server.extensions import ma


class PlexMediaTag(ma.Schema):
    tag = fields.String()


tag_field = fields.List(fields.Pluck(PlexMediaTag, "tag"))


class PlexVideoSerializer(ma.Schema):
    title = fields.String()
    thumbUrl = fields.URL(data_key="poster")
    summary = fields.String()
    duration = fields.String()
    actors = tag_field
    rating = fields.String()
    webUrl = fields.String()

    @pre_dump
    def plex_media_web_url(self, media, **kwargs):
        media.webUrl = "%s/web/index.html#!/server/%s/details?key=%s" % (
            media._server._baseurl,
            media._server.machineIdentifier,
            media.key,
        )
        return media


class PlexMovieSerializer(PlexVideoSerializer):
    directors = tag_field


class PlexSeriesSerializer(PlexVideoSerializer):
    seasonNumber = fields.Function(lambda ep: ep.seasonNumber)


plex_movie_serializer = PlexMovieSerializer()
plex_series_serializer = PlexSeriesSerializer()
