from server.config import STATIC_FOLDER, TEMPLATE_FOLDER
from flask import Blueprint

site = Blueprint(
    "site", __name__, template_folder=TEMPLATE_FOLDER, static_folder=STATIC_FOLDER
)

from . import index  # noqa
