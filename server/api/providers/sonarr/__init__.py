from flask import Blueprint

sonarr = Blueprint("sonarr", __name__)

from . import urls  # noqa