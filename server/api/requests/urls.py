from flask import Blueprint
from server.helpers import url

from . import views

requests_bp = Blueprint("requests", __name__)

url(requests_bp, views.add_request, ["/"], methods=["POST"])
