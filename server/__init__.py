from flask.app import Flask
from flask.helpers import get_debug_flag
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_talisman import Talisman
from flask_wtf.csrf import CSRFProtect, generate_csrf

from server.config import (
    STATIC_FOLDER,
    TEMPLATE_FOLDER,
    BaseConfig,
    DevConfig,
    ProdConfig,
)

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()


def create_app():
    """Creates a pre-configured Flask application.
    Defaults to using :class:`backend.config.ProdConfig`, unless the
    :envvar:`FLASK_DEBUG` environment variable is explicitly set to "true",
    in which case it uses :class:`backend.config.DevConfig`. Also configures
    paths for the templates folder and static files.
    """
    dev = get_debug_flag()
    return _create_app(
        DevConfig if dev else ProdConfig,
        template_folder=TEMPLATE_FOLDER,
        static_folder=STATIC_FOLDER,
    )


def _create_app(config_object: BaseConfig, **kwargs):
    """Creates a Flask application.
    :param object config_object: The config class to use.
    :param dict kwargs: Extra kwargs to pass to the Flask constructor.
    """
    app = Flask(__name__, **kwargs)
    app.config.from_object(config_object)

    db.init_app(app)
    csrf.init_app(app)
    Talisman(app)
    register_blueprints(app)
    register_commands(app)
    register_login_manager(app)

    @app.after_request
    def set_csrf_cookie(response):
        if response:
            response.set_cookie("csrf_token", generate_csrf())
        return response

    return app


def register_blueprints(app):
    from server.auth import auth
    from server.site import site

    app.register_blueprint(site)
    app.register_blueprint(auth)


def register_commands(app):
    from server.commands import init_db

    app.cli.add_command(init_db)


def register_login_manager(app):
    from server.auth.models import User

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)
