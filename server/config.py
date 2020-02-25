import os

FLASK_APP = "cheddarr"
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, "client", "build")
STATIC_FOLDER = os.environ.get(
    "FLASK_STATIC_FOLDER", os.path.join(PROJECT_ROOT, "client", "build", "static")
)


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
    SESSION_TYPE = "sqlalchemy"
    SESSION_PROTECTION = "strong"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_HTTPONLY = True

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProdConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    FLASK_DOMAIN = os.environ.get("FLASK_DOMAIN")
    ENV = "production"
    DEBUG = get_boolean_env("FLASK_DEBUG", False)

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_DOMAIN = FLASK_DOMAIN
    SESSION_COOKIE_SECURE = get_boolean_env("SESSION_COOKIE_SECURE", True)

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class DevConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    ENV = "development"
    DEBUG = get_boolean_env("FLASK_DEBUG", True)

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_SECURE = False

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(PROJECT_ROOT, "dev.db")


class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = True
    SERVER_NAME = "127.0.0.1:5000"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
