from marshmallow import fields, pre_dump

from server.extensions import ma


class PlexMediaTag(ma.Schema):
    tag = fields.String()


tag_field = fields.List(fields.Pluck(PlexMediaTag, "tag"))


class PlexVideoSerializer(ma.Schema):
    title = fields.String()
    thumbUrl = fields.URL(data_key="posterUrl")
    artUrl = fields.URL(data_key="artUrl")
    summary = fields.String()
    duration = fields.Integer()
    originallyAvailableAt = fields.Date(format="%d/%m/%Y", data_key="releaseDate")
    actors = tag_field
    studio = fields.String()
    genres = tag_field
    rating = fields.Float()
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
