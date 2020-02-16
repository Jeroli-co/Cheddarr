from flask import Blueprint
from flask.helpers import send_from_directory
from flask.templating import render_template
from .config import TEMPLATE_FOLDER, STATIC_FOLDER

server = Blueprint(
    "index", __name__, template_folder=TEMPLATE_FOLDER, static_folder=STATIC_FOLDER
)


@server.route("/", methods=["GET"])
@server.route("/<path:path>", methods=["GET"])
def index(path=None):
    return render_template("index.html")


@server.route("/favicon.ico")
def favicon():
    return send_from_directory(server.template_folder, "favicon.ico")
