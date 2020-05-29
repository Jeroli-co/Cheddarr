from flask import Blueprint

plex = Blueprint("plex", __name__)

from . import urls  # noqa
