from flask import Blueprint

from server.helpers import url
from . import views

search_bp = Blueprint("search", __name__)

url(search_bp, views.search_all, ["/"], methods=["GET"])
url(search_bp, views.search_tmdb_media, ["/all/"], methods=["GET"])
url(search_bp, views.search_tmdb_movies, ["/movies/"], methods=["GET"])
url(search_bp, views.search_tmdb_series, ["/series/"], methods=["GET"])
url(search_bp, views.get_tmdb_movie, ["/movies/<int:tmdb_id>/"], methods=["GET"])
url(search_bp, views.get_tmdb_series, ["/series/<int:tmdb_id>/"], methods=["GET"])
url(
    search_bp,
    views.get_tmdb_season,
    ["/series/<int:tmdb_id>/seasons/<int:season_number>/"],
    methods=["GET"],
)
