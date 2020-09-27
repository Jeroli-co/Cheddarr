import tmdbsimple as tmdb
from marshmallow import post_dump
from marshmallow.validate import OneOf

from server.extensions import ma

TMDB_URL = "https://www.themoviedb.org/"
TMDB_IMAGES_URL = "https://image.tmdb.org/t/p/"
TMDB_POSTER_SIZE = "w500"
TMDB_ART_SIZE = "w1280"


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


class TmdbMediaSchema(ma.Schema):
    id = ma.Integer()
    overview = ma.String(data_key="summary")
    vote_average = ma.Float(data_key="rating")
    poster_path = ma.String(data_key="thumbUrl")
    backdrop_path = ma.String(data_key="art_url")
    media_type = ma.String()
    status = ma.String()
    link = ma.Function(lambda media: f"{TMDB_URL}{media['media_type']}/{media['id']}")

    @post_dump
    def get_thumbUrl(self, media, **kwargs):
        if media.get("thumbUrl") is None:
            return media
        else:
            media[
                "thumbUrl"
            ] = f"{TMDB_IMAGES_URL}{TMDB_POSTER_SIZE}{media['thumbUrl']}"
        return media

    @post_dump
    def get_art_url(self, media, **kwargs):
        if media.get("art_url") is None:
            return media
        else:
            media["art_url"] = f"{TMDB_IMAGES_URL}{TMDB_POSTER_SIZE}{media['art_url']}"
        return media

    @post_dump
    def media_type(self, media, **kwargs):
        media["media_type"] = media.get("media_type").replace("tv", "series")
        return media


class TmdbMovieSchema(TmdbMediaSchema):
    title = ma.String()
    release_date = ma.String(data_key="releaseDate")
    media_type = ma.String(default="movie")
    link = ma.Function(lambda media: f"{TMDB_URL}movie/{media['id']}")


class TmdbSeriesSchema(TmdbMediaSchema):
    name = ma.String(data_key="title")
    first_air_date = ma.String(data_key="releaseDate")
    media_type = ma.String(default="series")
    seasons = ma.Nested("TmdbSeasonSchema", many=True)
    tvdb_id = ma.Function(
        lambda series: tmdb.TV(series["id"]).external_ids().get("tvdb_id")
    )
    link = ma.Function(lambda media: f"{TMDB_URL}tv/{media['id']}")


class TmdbSeasonSchema(ma.Schema):
    season_number = ma.Int()
    name = ma.String()
    air_date = ma.String(data_key="release_date")
    episodes = ma.Nested("TmdbEpisodeSchema", many=True)


class TmdbEpisodeSchema(ma.Schema):
    episode_number = ma.Int()
    name = ma.String()
    air_date = ma.String(data_key="release_date")


class TmdbMediaSearchResultSchema(ma.Schema):
    page = ma.Integer()
    total_pages = ma.Integer()
    total_results = ma.Integer()
    results = ma.Method("get_results")

    def get_results(self, search_results):
        res = []
        for media in search_results["results"]:
            if media["media_type"] == "movie":
                res.append(tmdb_movie_serializer.dump(media))
            elif media["media_type"] == "tv":
                res.append(tmdb_series_serializer.dump(media))
            else:
                continue
        return res


class TmdbMovieSearchResultSchema(TmdbMediaSearchResultSchema):
    results = ma.List(ma.Nested(TmdbMovieSchema))


class TmdbSeriesSearchResultSchema(TmdbMediaSearchResultSchema):
    results = ma.List(ma.Nested(TmdbSeriesSchema))


tmdb_movie_serializer = TmdbMovieSchema()
tmdb_series_serializer = TmdbSeriesSchema()
