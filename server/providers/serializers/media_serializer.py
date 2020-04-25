from marshmallow import fields, post_dump, pre_dump
from plexapi.media import Role

from server.extensions import ma


class PlexMediaTag(ma.Schema):
    tag = fields.String(data_key="name")
    role = fields.String()
    thumb = fields.String(data_key="thumbUrl")

    @pre_dump
    def remove_image(self, tag, **kwargs):
        if not isinstance(tag, Role):
            delattr(tag, "thumb")
            delattr(tag, "role")
        return tag


class PlexVideoSerializer(ma.Schema):
    type = fields.String()
    ratingKey = fields.String(data_key="id")
    title = fields.String()
    thumbUrl = fields.URL()
    artUrl = fields.URL()
    summary = fields.String()
    duration = fields.Integer()
    originallyAvailableAt = fields.Date(data_key="releaseDate")
    actors = fields.Nested(PlexMediaTag, many=True)
    studio = fields.String()
    genres = fields.Nested(PlexMediaTag, many=True)
    rating = fields.Float()
    contentRating = fields.String()
    isWatched = fields.Boolean()
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
    directors = fields.Nested(PlexMediaTag, many=True)


class PlexEpisodeSerializer(PlexVideoSerializer):
    grandparentRatingKey = fields.String(data_key="seriesId")
    grandparentTitle = fields.String(data_key="seriesTitle")
    seasonNumber = fields.Integer()
    index = fields.Integer(data_key="episodeNumber")
    seasonThumbUrl = fields.Function(lambda ep: ep.url(ep.parentThumb))

    @pre_dump
    def season_poster_url(self, episode, **kwargs):
        if episode.parentThumb is None:
            episode.parentThumb = episode.grandparentThumb
        return episode


class PlexSeasonSerializer(PlexVideoSerializer):
    parentRatingKey = fields.String(data_key="seriesId")
    seasonNumber = fields.Integer()
    episodes = fields.Nested(PlexEpisodeSerializer, many=True)

    @pre_dump
    def season_episodes(self, season, **kwargs):
        season.episodes = season.episodes()
        return season


class PlexSeriesSerializer(PlexVideoSerializer):
    seasons = fields.Nested(PlexSeasonSerializer, many=True, exclude=["episodes"])

    @pre_dump
    def series_seasons(self, series, **kwargs):
        series.seasons = series.seasons()
        return series


plex_movies_serializer = PlexMovieSerializer()
plex_series_serializer = PlexSeriesSerializer()
plex_seasons_serializer = PlexSeasonSerializer()
plex_episodes_serializer = PlexEpisodeSerializer()
