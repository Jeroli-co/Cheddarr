from flask.app import Flask
from flask.helpers import get_debug_flag
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


from server.config import (
    STATIC_FOLDER,
    TEMPLATE_FOLDER,
    BaseConfig,
    DevConfig,
    ProdConfig,
)

db = SQLAlchemy()


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
    register_blueprints(app)
    register_commands(app)

    CORS(app, resources={r"/*": {"origins": app.config["CLIENT_ADDR"]}})
    return app


def register_blueprints(app):
    from server.auth import auth
    from server.site import site

    app.register_blueprint(site)
    app.register_blueprint(auth)


def register_commands(app):
    from server.commands import init_db

    app.cli.add_command(init_db)
