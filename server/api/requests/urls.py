from flask import Blueprint

from server.helpers import url
from . import views

requests_bp = Blueprint("requests", __name__)

url(
    requests_bp,
    views.get_received_movie_requests,
    ["/movies/received/"],
    methods=["GET"],
)
url(requests_bp, views.get_sent_movie_requests, ["/movies/sent/"], methods=["GET"])
url(requests_bp, views.add_movie_request, ["/movies/"], methods=["POST"])
url(
    requests_bp,
    views.get_received_series_requests,
    ["/series/received/"],
    methods=["GET"],
)
url(requests_bp, views.get_sent_series_requests, ["/series/sent/"], methods=["GET"])
url(requests_bp, views.add_series_request, ["/series/"], methods=["POST"])
url(requests_bp, views.update_series_request, ["/series/<int:id>/"], methods=["PATCH"])
url(requests_bp, views.delete_series_request, ["/series/<int:id>/"], methods=["DELETE"])
