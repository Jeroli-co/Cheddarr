from server.extensions import ma


class TmdbMovieSchema(ma.Schema):
    id = ma.Integer()
    title = ma.String()
    release_date = ma.String(data_key="releaseDate")
    overview = ma.String(data_key="summary")
    vote_average = ma.Float(data_key="rating")
    poster_path = ma.String(data_key="thumbUrl")


class TmdbSearchResultSchema(ma.Schema):
    page = ma.Integer()
    total_pages = ma.Integer()
    total_results = ma.Integer()
    results = ma.List(ma.Nested(TmdbMovieSchema))
