from flask.app import Flask
from flask.helpers import get_debug_flag
from flask_cors import CORS

from server.index import server
from .config import STATIC_FOLDER, TEMPLATE_FOLDER, BaseConfig, DevConfig, ProdConfig


def create_app():
    """Creates a pre-configured Flask application.
    Defaults to using :class:`backend.config.ProdConfig`, unless the
    :envvar:`FLASK_DEBUG` environment variable is explicitly set to "true",
    in which case it uses :class:`backend.config.DevConfig`. Also configures
    paths for the templates folder and static files.
    """
    return _create_app(
        DevConfig if get_debug_flag() else ProdConfig,
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
    register_blueprints(app)
    CORS(app, resources={r"/*": {"origins": app.config["CLIENT_ADDR"]}})
    return app


def register_blueprints(app):

    app.register_blueprint(server)
