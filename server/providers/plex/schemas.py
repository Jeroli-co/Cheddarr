from marshmallow import pre_dump
from plexapi.media import Role

from server.extensions import ma
from server.providers.plex.models import PlexConfig


class PlexConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexConfig
        exclude = ("id", "name", "type", "api_key", "plex_user_id")


class PlexMediaTag(ma.Schema):
    tag = ma.String(data_key="name")
    role = ma.String()
    thumb = ma.String(data_key="thumbUrl")

    @pre_dump
    def remove_image(self, tag, **kwargs):
        if not isinstance(tag, Role):
            delattr(tag, "thumb")
            delattr(tag, "role")
        return tag


class PlexVideoSchema(ma.Schema):
    type = ma.String()
    ratingKey = ma.String(data_key="id")
    title = ma.String()
    thumbUrl = ma.URL()
    artUrl = ma.URL()
    summary = ma.String()
    originallyAvailableAt = ma.Date(data_key="releaseDate")
    rating = ma.Float()
    contentRating = ma.String()
    isWatched = ma.Boolean()
    webUrl = ma.String()

    @pre_dump
    def plex_media_web_url(self, media, **kwargs):
        media.webUrl = "%s/web/index.html#!/server/%s/details?key=%s" % (
            media._server._baseurl,
            media._server.machineIdentifier,
            media.key,
        )
        return media


class PlexMovieSchema(PlexVideoSchema):
    duration = ma.Integer()
    actors = ma.Nested(PlexMediaTag, many=True)
    directors = ma.Nested(PlexMediaTag, many=True)
    studio = ma.String()
    genres = ma.Nested(PlexMediaTag, many=True)

    @pre_dump
    def movie_actors(self, media, **kwargs):
        del media.actors[25:]
        return media


class PlexEpisodeSchema(PlexVideoSchema):
    grandparentRatingKey = ma.String(data_key="seriesId")
    grandparentTitle = ma.String(data_key="seriesTitle")
    seasonNumber = ma.Integer()
    index = ma.Integer(data_key="episodeNumber")
    seasonThumbUrl = ma.Function(lambda ep: ep.url(ep.parentThumb))
    duration = ma.Integer()

    @pre_dump
    def season_poster_url(self, episode, **kwargs):
        if episode.parentThumb is None:
            episode.parentThumb = episode.grandparentThumb
        return episode


class PlexSeasonSchema(PlexVideoSchema):
    parentRatingKey = ma.String(data_key="seriesId")
    parentTitle = ma.String(data_key = "seriesTitle")
    seasonNumber = ma.Integer()
    episodes = ma.Nested(PlexEpisodeSchema, many=True)

    @pre_dump
    def season_episodes(self, season, **kwargs):
        season.episodes = season.episodes()
        return season


class PlexSeriesSchema(PlexVideoSchema):
    seasons = ma.Nested(PlexSeasonSchema, many=True, exclude=["episodes"])
    actors = ma.Nested(PlexMediaTag, many=True)
    studio = ma.String()
    genres = ma.Nested(PlexMediaTag, many=True)

    @pre_dump
    def series_seasons(self, series, **kwargs):
        series.seasons = series.seasons()
        return series

    @pre_dump
    def series_actors(self, media, **kwargs):
        del media.actors[25:]
        return media

    @pre_dump
    def media_type(self, media, **kwargs):
        media.type = media.type.replace("show", "series")
        return media
