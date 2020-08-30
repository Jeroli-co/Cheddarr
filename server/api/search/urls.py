from server.helpers import url
from server.api.search import search

url(search, "search_all", ["/"], methods=["GET"])
