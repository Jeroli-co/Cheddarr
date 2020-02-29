from flask.blueprints import Blueprint
from .models import *  # noqa
from ..config import FLASK_TEMPLATE_FOLDER

auth = Blueprint(
    "auth",
    __name__,
    template_folder=FLASK_TEMPLATE_FOLDER,
    url_prefix="/api",
)

from . import routes  # noqa
