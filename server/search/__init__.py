from flask.blueprints import Blueprint

search = Blueprint("search", __name__)

from . import views  # noqa
