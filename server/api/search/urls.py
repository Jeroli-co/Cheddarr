from flask import Blueprint
from server.helpers import url

from . import views

search_bp = Blueprint("search", __name__)

url(search_bp, views.search_all, ["/"], methods=["GET"])
url(search_bp, views.search_media_online, ["/all/"], methods=["GET"])
url(search_bp, views.search_movies_online, ["/movies/"], methods=["GET"])
url(search_bp, views.search_series_online, ["/series/"], methods=["GET"])
