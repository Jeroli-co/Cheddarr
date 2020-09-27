from flask import Blueprint
from flask.helpers import send_from_directory
from flask.templating import render_template

from server.config import IMAGES_FOLDER, REACT_TEMPLATE_FOLDER

site_bp = Blueprint(
    "site",
    __name__,
    template_folder=REACT_TEMPLATE_FOLDER,
)


@site_bp.route("/")
@site_bp.route("/<path:path>/")
def index(path=None):
    return render_template("index.html")


@site_bp.route("/favico.ico/")
def favicon():
    return send_from_directory(REACT_TEMPLATE_FOLDER, "favicon.ico")


@site_bp.route("/manifest.json/")
def manifest():
    return send_from_directory(REACT_TEMPLATE_FOLDER, "manifest.json")


@site_bp.route("/images/<path:image_name>/")
def images(image_name):
    return send_from_directory(IMAGES_FOLDER, image_name)
