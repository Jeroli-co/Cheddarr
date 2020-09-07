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
    FLASK_TEMPLATE_FOLDER,
    PLEX_TOKEN_URL,
    REACT_STATIC_FOLDER,
    Config,
    DevConfig,
    ProdConfig,
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
    app.url_map.strict_slashes = False

    """Initialize extensions"""
    # used to register tasks to celery
    from server import tasks  # noqa

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
        "connect-src": ["'self'", PLEX_TOKEN_URL],
    }
    Talisman(app, content_security_policy=csp)
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": app.config.get("FLASK_DOMAIN")}},
    )

    @app.errorhandler(Exception)
    def handle_invalid_usage(error):
        if isinstance(error, HTTPException):
            name = error.name
            message = error.description
            code = error.code
        else:
            name = "Internal Server Error"
            message = "An error has occured."
            code = 500
            app.logger.error(error, exc_info=error)

        return jsonify({name: message}), code

    @app.context_processor
    def inject_now():
        return {"now": datetime.utcnow()}

    # Registrations
    register_blueprints(app)
    register_commands(app)
    register_login_manager(app)

    return app


def register_blueprints(app):
    """Register application's blueprints"""
    from server.api.auth import auth
    from server.api.friends import friends
    from server.api.profile import profile
    from server.api.providers import providers
    from server.api.search import search
    from server.site import site

    app.register_blueprint(site)
    app.register_blueprint(auth, url_prefix=API_ROOT)
    app.register_blueprint(friends, url_prefix=API_ROOT + "/friends")
    app.register_blueprint(profile, url_prefix=API_ROOT + "/profile")
    app.register_blueprint(providers, url_prefix=API_ROOT + "/providers")
    app.register_blueprint(search, url_prefix=API_ROOT + "/search")


def register_commands(app):
    """Register application's CLI commands"""
    from server.commands import init_db, test, worker

    app.cli.add_command(init_db)
    app.cli.add_command(worker)
    app.cli.add_command(test)


class CustomSessionInterface(SecureCookieSessionInterface):
    """Prevent creating session from API requests."""

    def save_session(self, *args, **kwargs):
        if g.get("login_via_header"):
            return
        return super(CustomSessionInterface, self).save_session(*args, **kwargs)
