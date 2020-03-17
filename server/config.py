import os
from datetime import timedelta

FLASK_APP = "cheddarr"
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
REACT_TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, "client", "build")
REACT_STATIC_FOLDER = os.path.join(PROJECT_ROOT, "client", "build", "static")
FLASK_TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, "server", "templates")
SESSION_LIFETIME = 60  # Minutes
REMEMBER_COOKIE_LIFETIME = 7  # Days


def get_boolean_env(name, default):
    default = "true" if default else "false"
    return os.getenv(name, default).lower() in ["true", "yes", "1"]


class BaseConfig(object):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    DEBUG = get_boolean_env("FLASK_DEBUG", False)
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "not-secret-key")

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=SESSION_LIFETIME)
    REMEMBER_COOKIE_DURATION = timedelta(days=REMEMBER_COOKIE_LIFETIME)
    REMEMBER_COOKIE_NAME = "remember"

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ##########################################################################
    # security                                                               #
    ##########################################################################
    SECURITY_PASSWORD_SALT = os.environ.get(
        "FLASK_SECURITY_PASSWORD_SALT", "security-password-salt"
    )

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
    MAIL_DEFAULT_SENDER = (
        os.environ.get("FLASK_MAIL_DEFAULT_SENDER_NAME", "Cheddarr"),
        os.environ.get(
            "FLASK_MAIL_DEFAULT_SENDER_EMAIL",
            f"noreply@{os.environ.get('FLASK_DOMAIN', 'localhost')}",
        ),
    )

    ##########################################################################
    # oauth                                                                  #
    ##########################################################################
    GOOGLE_OAUTH_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    FACEBOOK_OAUTH_CLIENT_ID = os.environ.get("FACEBOOK_CLIENT_ID")
    FACEBOOK_OAUTH_CLIENT_SECRET = os.environ.get("FACEBOOK_CLIENT_SECRET")


class ProdConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    FLASK_DOMAIN = os.environ.get("FLASK_DOMAIN")
    FLASK_ENV = "production"
    DEBUG = get_boolean_env("FLASK_DEBUG", False)

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_DOMAIN = FLASK_DOMAIN
    REMEMBER_COOKIE_DOMAIN = FLASK_DOMAIN
    REMEMBER_COOKIE_HTTPONLY = True

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class DevConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    FLASK_DOMAIN = "http://localhost:5000"
    FLASK_ENV = "development"
    DEBUG = get_boolean_env("FLASK_DEBUG", True)

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(PROJECT_ROOT, "dev.db")

    ##########################################################################
    # oauth                                                                  #
    ##########################################################################
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


class TestConfig(BaseConfig):
    FLASK_DOMAIN = "http://localhost:5000"
    TESTING = True
    DEBUG = True
    SERVER_NAME = "localhost"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
