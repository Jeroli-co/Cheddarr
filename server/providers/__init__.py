from flask.blueprints import Blueprint

provider = Blueprint("provider", __name__)

from .views import plex, radarr, sonarr  # noqa
