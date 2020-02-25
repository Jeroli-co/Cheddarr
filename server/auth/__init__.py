from flask.blueprints import Blueprint
from server.config import STATIC_FOLDER, TEMPLATE_FOLDER
from .models import *  # noqa

auth = Blueprint(
    "auth", __name__, template_folder=TEMPLATE_FOLDER, static_folder=STATIC_FOLDER
)

from . import views  # noqa
