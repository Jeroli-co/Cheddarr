from server.api.search import search
from server.helpers import url

url(search, "search_all", ["/"], methods=["GET"])
url(search, "search_online_media", ["/media/"], methods=["GET"])
url(search, "search_online_movies", ["/movies/"], methods=["GET"])
url(search, "search_online_series", ["/series/"], methods=["GET"])
