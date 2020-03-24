import base64
from datetime import datetime
from http import HTTPStatus

from flask import jsonify, g
from flask.app import Flask
from flask.helpers import get_debug_flag
from flask.sessions import SecureCookieSessionInterface
from flask_cors import CORS
from flask_login import LoginManager, user_loaded_from_header
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_talisman import Talisman
from flask_wtf.csrf import CSRFProtect, generate_csrf
from sendgrid import sendgrid

from server.config import (
    BaseConfig,
    DevConfig,
    ProdConfig,
    REACT_STATIC_FOLDER,
    REACT_TEMPLATE_FOLDER,
)
from server.exceptions import InvalidUsage


"""Global extensions"""
db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
login_manager = LoginManager()
csrf = CSRFProtect()
mail = sendgrid.SendGridAPIClient()


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
        template_folder=REACT_TEMPLATE_FOLDER,
        static_folder=REACT_STATIC_FOLDER,
    )


def _create_app(config_object: BaseConfig, **kwargs):
    """Creates a Flask application.
    :param object config_object: The config class to use.
    :param dict kwargs: Extra kwargs to pass to the Flask constructor.
    """
    app = Flask(__name__, **kwargs)
    app.config.from_object(config_object)
    app.session_interface = CustomSessionInterface()
    db.init_app(app)
    ma.init_app(app)
    with app.app_context():
        if db.engine.url.drivername == "sqlite":
            migrate.init_app(app, db, render_as_batch=True)
        else:
            migrate.init_app(app, db)

    csrf.init_app(app)
    mail.api_key = app.config.get("MAIL_SENDGRID_API_KEY")
    csp = {"default-src": "'self'", "img-src": "*"}
    Talisman(app, content_security_policy=csp)
    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": app.config.get("FLASK_DOMAIN")}},
    )

    register_blueprints(app)
    register_commands(app)
    register_login_manager(app)

    @app.after_request
    def set_csrf_cookie(response):
        if response:
            response.set_cookie("csrf_token", generate_csrf())
        return response

    @app.errorhandler(InvalidUsage)
    def handle_invalid_usage(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.context_processor
    def inject_now():
        return {"now": datetime.utcnow()}

    return app


def register_blueprints(app):
    from server.auth import auth, facebook_bp, google_bp
    from server.site import site
    from server.profile import profile

    app.register_blueprint(site)
    app.register_blueprint(auth, url_prefix="/api")
    app.register_blueprint(profile, url_prefix="/api")
    app.register_blueprint(facebook_bp)
    app.register_blueprint(google_bp)


def register_commands(app):
    from server.commands import init_db_command

    app.cli.add_command(init_db_command)


def register_login_manager(app):
    from server.auth.models import User

    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.filter_by(session_token=user_id).first()

    @login_manager.unauthorized_handler
    def unauthorized():
        raise InvalidUsage("Unauthorized", status_code=HTTPStatus.UNAUTHORIZED)

    @login_manager.needs_refresh_handler
    def refresh():
        raise InvalidUsage("Need to authenticate", status_code=HTTPStatus.UNAUTHORIZED)

    @login_manager.request_loader
    def load_user_from_request(request):
        from server.utils import confirm_token

        # try to login using the api_key url arg
        api_key = request.args.get("api_key")
        if api_key:
            user = User.query.filter_by(api_key=confirm_token(api_key)).first()
            if user:
                print(user)
                return user

        # try to login using Basic Auth
        if (
            request.authorization
            and request.authorization.username
            and request.authorization.password
        ):
            user = User.find(username=request.authorization.username)
            if user:
                if user.check_password(request.authorization.password):
                    return user
        # return None if both methods did not login the user
        return None


def register_oauth_providers(oauth):
    oauth.register("google", client_kwargs={"scope": "openid email profile"})
    oauth.register("facebook")


@user_loaded_from_header.connect
def user_loaded_from_header(self, user=None):
    g.login_via_header = True


class CustomSessionInterface(SecureCookieSessionInterface):
    """Prevent creating session from API requests."""

    def save_session(self, *args, **kwargs):
        if g.get("login_via_header"):
            return
        return super(CustomSessionInterface, self).save_session(*args, **kwargs)
