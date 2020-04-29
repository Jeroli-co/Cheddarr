from flask import Blueprint

profile = Blueprint("profile", __name__)

from .views import user_profile, friends  # noqa
