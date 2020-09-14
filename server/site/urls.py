from flask import Blueprint
from server.config import REACT_TEMPLATE_FOLDER
from server.helpers import url
from . import views

site_bp = Blueprint(
    "site",
    __name__,
    template_folder=REACT_TEMPLATE_FOLDER,
)

url(site_bp, views.index, ["/", "/<path:path>/"], methods=["GET"])
url(site_bp, views.favicon, ["/favicon.ico/"], methods=["GET"])
url(site_bp, views.manifest, ["/manifest.json/"], methods=["GET"])
url(site_bp, views.images, ["/images/<path:image_name>/"], methods=["GET"])
