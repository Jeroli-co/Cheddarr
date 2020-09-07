import tmdbsimple as tmdb

tmdb_search = tmdb.Search()
tmdb_config = tmdb.Configuration().info()
tmdb_images_url = tmdb_config.get("images").get("secure_base_url")
tmdb_poster_size = tmdb_config.get("images").get("poster_sizes")[4]
