from marshmallow import fields, post_dump, pre_dump

from server.extensions import ma


class PlexMediaTag(ma.Schema):
    tag = fields.String()


tag_field = fields.List(fields.Pluck(PlexMediaTag, "tag"))


class PlexVideoSerializer(ma.Schema):
    type = fields.String()
    ratingKey = fields.String(data_key="id")
    title = fields.String()
    thumbUrl = fields.URL(data_key="posterUrl")
    artUrl = fields.URL(data_key="artUrl")
    summary = fields.String()
    duration = fields.Integer()
    originallyAvailableAt = fields.Date(data_key="releaseDate")
    actors = tag_field
    studio = fields.String()
    genres = tag_field
    rating = fields.Float()
    contentRating = fields.String()
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


class PlexEpisodeSerializer(PlexVideoSerializer):
    parentRatingKey = fields.String(data_key="seasonId")
    grandparentRatingKey = fields.String(data_key="seriesId")
    seasonNumber = fields.Integer()
    index = fields.Integer(data_key="episodeNumber")
    seasonPosterUrl = fields.Function(lambda ep: ep.url(ep.parentThumb))

    @pre_dump
    def season_poster_url(self, episode, **kwargs):
        if episode.parentThumb is None:
            episode.parentThumb = episode.grandparentThumb
        return episode


class PlexSeasonSerializer(PlexVideoSerializer):
    parentRatingKey = fields.String(data_key="seriesId")
    episodes = fields.Nested(PlexEpisodeSerializer, many=True)

    @pre_dump
    def season_episodes(self, season, **kwargs):
        season.episodes = season.episodes()
        return season


class PlexSeriesSerializer(PlexVideoSerializer):
    seasons = fields.Nested(PlexSeasonSerializer, many=True)

    @pre_dump
    def series_seasons(self, series, **kwargs):
        series.seasons = series.seasons()
        return series


plex_movies_serializer = PlexMovieSerializer(many=True)
plex_movie_serializer = PlexMovieSerializer()
plex_series_serializer = PlexSeriesSerializer()
plex_season_serializer = PlexSeasonSerializer()
plex_episodes_serializer = PlexEpisodeSerializer(many=True)
