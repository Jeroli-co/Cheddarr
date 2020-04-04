import os
from datetime import timedelta

APP_NAME = "Cheddarr"

##########################################################################
# folders                                                                #
##########################################################################
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
REACT_TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, "client", "build")
REACT_STATIC_FOLDER = os.path.join(PROJECT_ROOT, "client", "build", "static")
FLASK_TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, "server", "templates")

##########################################################################
# api                                                                    #
##########################################################################
API_ROOT = "/api"
PLEX_REQUEST_TOKEN_URL = "https://plex.tv/api/v2/pins?strong=true"
PLEX_AUTHORIZE_URL = "https://app.plex.tv/auth#"
PLEX_ACCESS_TOKEN_URL = "https://plex.tv/api/v2/pins"
PLEX_USER_RESOURCE_URL = "https://plex.tv/users/account.json"


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
    REMEMBER_COOKIE_LIFETIME = 365  # Days
    REMEMBER_COOKIE_DURATION = timedelta(days=REMEMBER_COOKIE_LIFETIME)
    RATELIMIT_DEFAULT = "500/hour"

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
    WTF_CSRF_ENABLED = False

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
    REMEMBER_COOKIE_SECURE = True
    REMEMBER_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class DevConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    FLASK_DOMAIN = "localhost"
    FLASK_ENV = "development"
    DEBUG = get_boolean_env("FLASK_DEBUG", True)

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(PROJECT_ROOT, "dev.db")


class TestConfig(BaseConfig):
    FLASK_DOMAIN = "localhost"
    TESTING = True
    DEBUG = True
    SERVER_NAME = "localhost"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
