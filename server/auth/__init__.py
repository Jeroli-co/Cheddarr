from flask.blueprints import Blueprint
from ..config import FLASK_TEMPLATE_FOLDER

auth = Blueprint("auth", __name__, template_folder=FLASK_TEMPLATE_FOLDER)

from . import routes  # noqa
