from flask import Blueprint

friends = Blueprint("friends", __name__)

from . import urls  # noqa
