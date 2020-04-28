from flask.blueprints import Blueprint
from server.config import FLASK_TEMPLATE_FOLDER

search = Blueprint("search", __name__, template_folder=FLASK_TEMPLATE_FOLDER)

from . import routes
