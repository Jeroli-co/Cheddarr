from flask.helpers import send_from_directory
from flask.templating import render_template
from server.config import IMAGES_FOLDER
from server.site import site


@site.route("/", methods=["GET"])
@site.route("/<path:path>/", methods=["GET"])
def index(path=None):
    return render_template("index.html")


@site.route("/favicon.ico/")
def favicon():
    return send_from_directory(site.template_folder, "favicon.ico")


@site.route("/manifest.json/")
def manifest():
    return send_from_directory(site.template_folder, "manifest.json")


@site.route("/images/<image_name>/", methods=["GET"])
def images(image_name):
    return send_from_directory(IMAGES_FOLDER, image_name)
