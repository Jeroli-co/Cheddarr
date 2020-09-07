from server.api.search import search
from server.helpers import url

url(search, "search_all", ["/"], methods=["GET"])
url(search, "search_media_online", ["/all/"], methods=["GET"])
url(search, "search_movies_online", ["/movies/"], methods=["GET"])
url(search, "search_series_online", ["/series/"], methods=["GET"])
