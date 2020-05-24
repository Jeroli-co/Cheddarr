from datetime import datetime

from flask import g, jsonify
from flask.app import Flask
from flask.helpers import get_debug_flag
from flask.sessions import SecureCookieSessionInterface
from flask_cors import CORS
from flask_talisman import Talisman
from werkzeug.exceptions import HTTPException

from server.config import (
    API_ROOT,
    Config,
    DevConfig,
    FLASK_TEMPLATE_FOLDER,
    ProdConfig,
    REACT_STATIC_FOLDER,
)
from server.extensions import cache, celery, db, limiter, ma, mail, migrate
from server.extensions.login_manager import register_login_manager


def create_app():
    """Creates a pre-configured Flask application.
    Defaults to using :class:`server.config.ProdConfig`, unless the
    :envvar:`FLASK_DEBUG` environment variable is explicitly set to "true",
    in which case it uses :class:`server.config.DevConfig`. Also configures
    paths for the templates folder and static files.
    """
    dev = get_debug_flag()
    return _create_app(
        DevConfig if dev else ProdConfig,
        template_folder=FLASK_TEMPLATE_FOLDER,
        static_folder=REACT_STATIC_FOLDER,
    )


def _create_app(config_object: Config, **kwargs):
    """Creates a Flask application.
    :param object config_object: The config class to use.
    :param dict kwargs: Extra kwargs to pass to the Flask constructor.
    """
    app = Flask(__name__, **kwargs)
    app.config.from_object(config_object)
    app.session_interface = CustomSessionInterface()

    """Initialize extensions"""
    celery.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)
    mail.api_key = config_object.MAIL_SENDGRID_API_KEY

    """Security patches"""
    csp = {
        "default-src": "'self'",
        "img-src": ["*", "'self'", "data:"],
        "style-src": ["'self'", "'unsafe-inline'"],
    }
    Talisman(app, content_security_policy=csp)
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": app.config.get("FLASK_DOMAIN")}},
    )

    @app.errorhandler(Exception)
    def handle_invalid_usage(error):
        message = str(error)
        code = 500
        if isinstance(error, HTTPException):
            message = error.description
            code = error.code
        return jsonify({"message": message}), code

    @app.context_processor
    def inject_now():
        return {"now": datetime.utcnow()}

    register_blueprints(app)
    register_commands(app)
    register_login_manager(app)

    return app


def register_blueprints(app):
    """Register application's blueprints"""
    from server.site import site
    from server.auth import auth
    from server.profile import profile
    from server.providers.plex import plex
    from server.providers.radarr import radarr
    from server.providers.sonarr import sonarr
    from server.search import search

    app.register_blueprint(site)
    app.register_blueprint(auth, url_prefix=API_ROOT)
    app.register_blueprint(profile, url_prefix=API_ROOT + "/profile")
    app.register_blueprint(plex, url_prefix=API_ROOT + "/providers/plex")
    app.register_blueprint(radarr, url_prefix=API_ROOT + "/providers/radarr")
    app.register_blueprint(sonarr, url_prefix=API_ROOT + "/providers/sonarr")
    app.register_blueprint(search, url_prefix=API_ROOT + "/search")


def register_commands(app):
    """Register application's CLI commands"""
    from server.commands import init_db, worker, test

    app.cli.add_command(init_db)
    app.cli.add_command(worker)
    app.cli.add_command(test)


class CustomSessionInterface(SecureCookieSessionInterface):
    """Prevent creating session from API requests."""

    def save_session(self, *args, **kwargs):
        if g.get("login_via_header"):
            return
        return super(CustomSessionInterface, self).save_session(*args, **kwargs)
