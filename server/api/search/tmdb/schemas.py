from marshmallow.decorators import post_dump
from server.api.search.tmdb import TMDB_IMAGES_URL, TMDB_POSTER_SIZE
from server.extensions import ma


class TmdbMediaSchema(ma.Schema):
    id = ma.Integer()
    overview = ma.String(data_key="summary")
    vote_average = ma.Float(data_key="rating")
    poster_path = ma.String(data_key="thumbUrl")

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
    def media_type(self, media, **kwargs):
        media["media_type"] = media.get("media_type").replace("tv", "series")
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
