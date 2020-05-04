from flask.blueprints import Blueprint

auth = Blueprint("auth", __name__)

from .views import signup, signin, signout, reset_password, api  # noqa
