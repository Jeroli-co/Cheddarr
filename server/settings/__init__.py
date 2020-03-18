from flask import Blueprint

from ..config import FLASK_TEMPLATE_FOLDER

settings = Blueprint("settings", __name__, template_folder=FLASK_TEMPLATE_FOLDER)

from . import routes  # noqa
