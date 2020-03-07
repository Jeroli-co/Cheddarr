from flask.blueprints import Blueprint
from flask_dance.consumer.storage.sqla import SQLAlchemyStorage
from flask_dance.contrib.facebook import make_facebook_blueprint
from flask_login import current_user
from server import db
from .models import User, OAuth
from ..config import FLASK_TEMPLATE_FOLDER

auth = Blueprint(
    "auth",
    __name__,
    template_folder=FLASK_TEMPLATE_FOLDER,
)


facebook_bp = make_facebook_blueprint(
    storage=SQLAlchemyStorage(OAuth, db.session, user=current_user), redirect_url="/facebook/authorized"
)

from .routes import signup, signin, signout, reset_password  # noqa
