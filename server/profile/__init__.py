from flask import Blueprint

from server.config import FLASK_TEMPLATE_FOLDER

profile = Blueprint("profile", __name__, template_folder=FLASK_TEMPLATE_FOLDER)

from . import routes  # noqa
