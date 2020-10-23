from enum import Enum


class MediaType(str, Enum):
    movies = "movies"
    series = "series"


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class ProviderType(str, Enum):
    movie_provider = "movie_provider"
    series_provider = "series_provider"
    media_server = "media_server"
