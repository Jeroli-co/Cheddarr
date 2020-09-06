import tmdbsimple as tmdb

tmdb_config = tmdb.Configuration().info()
tmdb_movies = tmdb.Movies()
tmdb_search = tmdb.Search()

tmdb_images_url = tmdb_config.get("images").get("secure_base_url")
tmdb_poster_sizes = tmdb_config.get("images").get("poster_sizes")
