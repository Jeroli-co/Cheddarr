from flask import Blueprint

providers_bp = Blueprint("providers", __name__)

from .plex import urls  # noqa
from .radarr import urls  # noqa
from .sonarr import urls  # noqa
