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
IMAGES_FOLDER = os.path.join(PROJECT_ROOT, "server", "images")

##########################################################################
# api                                                                    #
##########################################################################
API_ROOT = "/api"
PLEX_CLIENT_IDENTIFIER = os.environ.get("PLEX_CLIENT_IDENTIFIER", APP_NAME)
PLEX_REQUEST_TOKEN_URL = "https://plex.tv/api/v2/pins/?strong=true"
PLEX_AUTHORIZE_URL = "https://app.plex.tv/auth#/"
PLEX_ACCESS_TOKEN_URL = "https://plex.tv/api/v2/pins/"
PLEX_USER_RESOURCE_URL = "https://plex.tv/users/account.json/"
##########################################################################


class Config(object):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
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
    WTF_CSRF_ENABLED = False

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
    MAIL_DEFAULT_SENDER = (
        f"noreply@{os.environ.get('FLASK_DOMAIN', 'localhost')}",
        APP_NAME,
    )

    ##########################################################################
    # celery                                                                 #
    ##########################################################################
    CELERY_BROKER_URL = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379")
    CELERY_RESULT_BACKEND = CELERY_BROKER_URL


class ProdConfig(Config):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    FLASK_DOMAIN = os.environ.get(
        "FLASK_DOMAIN", os.environ.get("HEROKU_APP_NAME", "") + ".herokuapp.com"
    )

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_DOMAIN = FLASK_DOMAIN
    REMEMBER_COOKIE_DOMAIN = FLASK_DOMAIN
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    ##########################################################################
    # cache                                                                  #
    ##########################################################################
    CACHE_TYPE = "redis"
    CACHE_REDIS_URL = os.environ.get("REDIS_URL", "localhost:6379")
    CACHE_DEFAULT_TIMEOUT = 60


class DevConfig(Config):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    FLASK_DOMAIN = "localhost"

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(PROJECT_ROOT, "dev.db")

    ##########################################################################
    # cache                                                                  #
    ##########################################################################
    CACHE_TYPE = "filesystem"
    CACHE_DIR = "./tmp"


class TestConfig(Config):
    FLASK_DOMAIN = "localhost"
    TESTING = True
    DEBUG = True
    SERVER_NAME = "localhost"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    CACHE_TYPE = "null"
