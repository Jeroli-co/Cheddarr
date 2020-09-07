from server.helpers import url

from . import search, views

url(search, views.search_all, ["/"], methods=["GET"])
url(search, views.search_media_online, ["/all/"], methods=["GET"])
url(search, views.search_movies_online, ["/movies/"], methods=["GET"])
url(search, views.search_series_online, ["/series/"], methods=["GET"])
