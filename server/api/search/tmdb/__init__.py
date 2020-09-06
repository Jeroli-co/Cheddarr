import tmdbsimple as tmdb
from server.extensions import cache

tmdb_search = tmdb.Search()


@cache.cached(100000)  # cached for about a day
def tmdb_images_config():
    return tmdb.Configuration().info()


tmdb_images_url = tmdb_images_config().get("images").get("secure_base_url")
tmdb_poster_size = tmdb_images_config().get("images").get("poster_sizes")[4]
