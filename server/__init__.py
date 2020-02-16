import os
from flask.app import Flask
from flask.helpers import get_debug_flag
from flask_cors import CORS
from pymongo import MongoClient
from server.index import server
from .config import STATIC_FOLDER, TEMPLATE_FOLDER, BaseConfig, DevConfig, ProdConfig


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
        "development.cfg" if dev else None,
        instance_relative_config=True if dev else False,
        template_folder=TEMPLATE_FOLDER,
        static_folder=STATIC_FOLDER,
    )


def _create_app(config_object: BaseConfig, config_filename, **kwargs):
    """Creates a Flask application.
    :param object config_object: The config class to use.
    :param dict kwargs: Extra kwargs to pass to the Flask constructor.
    """
    app = Flask(__name__, **kwargs)
    app.config.from_object(config_object)
    if config_filename:
        app.config.from_pyfile(config_filename)
    register_blueprints(app)

    mongo_db_uri = os.environ.get("MONGODB_URI") or app.config["MONGODB_URI"]
    if mongo_db_uri is None:
        app.config["dbClient"] = MongoClient()
    else:
        app.config["dbClient"] = MongoClient(mongo_db_uri, ssl=True)
    app.config["db"] = app.config["dbClient"][os.environ.get("DB") or app.config["DB"]]
    print(app.config["dbClient"])
    CORS(app, resources={r"/*": {"origins": app.config["CLIENT_ADDR"]}})
    return app


def register_blueprints(app):
    app.register_blueprint(server)
