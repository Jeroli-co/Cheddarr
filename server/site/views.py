from flask.helpers import send_from_directory
from flask.templating import render_template
from server.config import IMAGES_FOLDER, REACT_TEMPLATE_FOLDER


def index(path=None):
    return render_template("index.html")


def favicon():
    return send_from_directory(REACT_TEMPLATE_FOLDER, "favicon.ico")


def manifest():
    return send_from_directory(REACT_TEMPLATE_FOLDER, "manifest.json")


def images(image_name):
    return send_from_directory(IMAGES_FOLDER, image_name)
