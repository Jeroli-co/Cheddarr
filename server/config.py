import os

APP_NAME = "Cheddarr"
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


class ProdConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    ENV = "production"
    DEBUG = get_boolean_env("FLASK_DEBUG", False)
    CLIENT_ADDR = ["https://cheddarr.herokuapp.com"]

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_DOMAIN = os.environ.get("FLASK_DOMAIN", "cheddarr.herokuapp.com")
    SESSION_COOKIE_SECURE = get_boolean_env("SESSION_COOKIE_SECURE", True)


class DevConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    ENV = "development"
    DEBUG = get_boolean_env("FLASK_DEBUG", True)
    CLIENT_ADDR = ["http://127.0.0.1:4200", "http://localhost:4200"]

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_SECURE = False


class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = True
    SERVER_NAME = "127.0.0.1:5000"
    CLIENT_ADDR = ["http://127.0.0.1:4200", "http://localhost:4200"]
