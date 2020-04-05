from flask.blueprints import Blueprint
from server.config import FLASK_TEMPLATE_FOLDER

auth = Blueprint("auth", __name__, template_folder=FLASK_TEMPLATE_FOLDER)

from . import signup, signin, signout, reset_password, api  # noqa
