from flask.blueprints import Blueprint
from server.config import FLASK_TEMPLATE_FOLDER

provider = Blueprint("provider", __name__, template_folder=FLASK_TEMPLATE_FOLDER)

from . import plex, radarr  # noqa
