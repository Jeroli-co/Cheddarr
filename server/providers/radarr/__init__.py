from flask import Blueprint

radarr = Blueprint("radarr", __name__)

from . import urls  # noqa
