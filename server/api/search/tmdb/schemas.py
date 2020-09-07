from marshmallow.decorators import post_dump
from server.extensions import ma

from . import tmdb_images_url, tmdb_poster_size


class TmdbMediaSchema(ma.Schema):
    id = ma.Integer()
    overview = ma.String(data_key="summary")
    vote_average = ma.Float(data_key="rating")
    poster_path = ma.String(data_key="thumbUrl")

    @post_dump
    def get_thumbUrl(self, media, **kwargs):
        if media["thumbUrl"] is None:
            media["thumbUrl"] = ""
        else:
            media[
                "thumbUrl"
            ] = f"{tmdb_images_url}{tmdb_poster_size}{media['thumbUrl']}"
        return media

    @post_dump
    def media_type(self, media, **kwargs):
        media["media_type"] = media["media_type"].replace("tv", "series")
        return media


class TmdbMovieSchema(TmdbMediaSchema):
    title = ma.String()
    release_date = ma.String(data_key="releaseDate")
    media_type = ma.String(default="movie")


class TmdbSeriesSchema(TmdbMediaSchema):
    name = ma.String(data_key="title")
    first_air_date = ma.String(data_key="releaseDate")
    media_type = ma.String(default="series")


class TmdbMediaSearchResultSchema(ma.Schema):
    page = ma.Integer()
    total_pages = ma.Integer()
    total_results = ma.Integer()
    results = ma.Method("get_results")

    def get_results(self, search_results):
        return [
            tmdb_movie_serializer.dump(media)
            if media["media_type"] == "movie"
            else tmdb_series_serializer.dump(media)
            for media in search_results["results"]
        ]


class TmdbMovieSearchResultSchema(TmdbMediaSearchResultSchema):
    results = ma.List(ma.Nested(TmdbMovieSchema))


class TmdbSeriesSearchResultSchema(TmdbMediaSearchResultSchema):
    results = ma.List(ma.Nested(TmdbSeriesSchema))


tmdb_movie_serializer = TmdbMovieSchema()
tmdb_series_serializer = TmdbSeriesSchema()
