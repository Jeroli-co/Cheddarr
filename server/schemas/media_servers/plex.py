from marshmallow import post_dump, pre_dump, post_load
from plexapi.media import Role

from server.extensions import ma
from server.models import PlexConfig, PlexServer


class PlexServerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PlexServer
        load_instance = True


class PlexConfigSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        table = (
            PlexConfig.__table__
        )  # table instead of model for the AutoSchema with Concrete Inheritance

    servers = ma.Nested(PlexServerSchema, many=True)

    @post_load
    def make_config(self, data, **kwargs):
        return PlexConfig(**data)


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
    webUrl = ma.Function(
        lambda media: "%s/web/index.html#!/server/%s/details?key=%s"
        % (
            media._server._baseurl,
            media._server.machineIdentifier,
            media.key,
        )
    )


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
    _links = ma.Hyperlinks(
        {
            "self": ma.AbsoluteURLFor(
                "media_servers.get_plex_episode",
                episode_id="<ratingKey>",
            ),
        }
    )

    @pre_dump
    def season_poster_url(self, episode, **kwargs):
        if episode.parentThumb is None:
            episode.parentThumb = episode.grandparentThumb
        return episode


class PlexSeasonSchema(PlexVideoSchema):
    parentRatingKey = ma.String(data_key="seriesId")
    parentTitle = ma.String(data_key="seriesTitle")
    seasonNumber = ma.Integer()
    episodes = ma.Nested(PlexEpisodeSchema, many=True)
    _links = ma.Hyperlinks(
        {
            "self": ma.AbsoluteURLFor(
                "media_servers.get_plex_season",
                season_id="<ratingKey>",
            ),
        }
    )

    @pre_dump
    def season_episodes(self, season, **kwargs):
        season.episodes = season.episodes()
        return season


class PlexSeriesSchema(PlexVideoSchema):
    seasons = ma.Nested(PlexSeasonSchema, many=True, exclude=["episodes"])
    actors = ma.Nested(PlexMediaTag, many=True)
    studio = ma.String()
    genres = ma.Nested(PlexMediaTag, many=True)
    _links = ma.Hyperlinks(
        {
            "self": ma.AbsoluteURLFor(
                "media_servers.get_plex_series", series_id="<ratingKey>"
            ),
        }
    )

    @pre_dump
    def series_seasons(self, series, **kwargs):
        series.seasons = series.seasons()
        return series

    @pre_dump
    def series_actors(self, media, **kwargs):
        del media.actors[25:]
        return media

    @post_dump
    def media_type(self, media, **kwargs):
        media["type"] = media.get("type").replace("show", "series")
        return media
