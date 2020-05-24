from server.helpers import url
from server.search import search

url(search, "search_all", ["/"], methods=["GET"])
