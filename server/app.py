from flask import g, jsonify
from flask.app import Flask
from flask.helpers import get_debug_flag
from flask.sessions import SecureCookieSessionInterface
from flask_cors import CORS
from flask_talisman import Talisman
from werkzeug.exceptions import HTTPException, UnprocessableEntity

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

    # Registrations
    register_error_handlers(app)
    register_security_patches(app)
    register_extensions(app)
    register_blueprints(app)
    register_commands(app)
    register_login_manager(app)

    return app


def register_security_patches(app):
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


def register_error_handlers(app):
    def handle_error(err):
        messages = err.data.get("messages", ["Invalid request."])
        return jsonify({"errors": messages}), err.code

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

    app.register_error_handler(UnprocessableEntity, handle_error)
    app.register_error_handler(Exception, handle_invalid_usage)


def register_extensions(app):
    """Initialize extensions"""
    with app.app_context():

        celery.init_app(app)
        db.init_app(app)
        migrate.init_app(app, db)
        ma.init_app(app)
        limiter.init_app(app)
        cache.init_app(app)
        mail.api_key = app.config.get("MAIL_SENDGRID_API_KEY")


def register_blueprints(app):
    """Register application's blueprints"""
    from server.site.index import site_bp
    from server.api.users import users_bp
    from server.api.auth import auth_bp
    from server.api.requests import requests_bp
    from server.api.search import search_bp
    from server.api.providers.base import providers_bp
    from server.api.media_servers.base import media_servers_bp

    app.register_blueprint(site_bp)
    app.register_blueprint(users_bp, url_prefix=API_ROOT)
    app.register_blueprint(auth_bp, url_prefix=API_ROOT)
    app.register_blueprint(media_servers_bp, url_prefix=API_ROOT + "/media-servers")
    app.register_blueprint(providers_bp, url_prefix=API_ROOT + "/providers")
    app.register_blueprint(requests_bp, url_prefix=API_ROOT + "/requests")
    app.register_blueprint(search_bp, url_prefix=API_ROOT + "/search")


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
