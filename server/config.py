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
    SECURITY_PASSWORD_SALT = os.environ.get('FLASK_SECURITY_PASSWORD_SALT',
                                            'security-password-salt')

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_SERVER = os.environ.get('MAILGUN_SMTP_SERVER', 'localhost')
    MAIL_PORT = int(os.environ.get('MAILGUN_SMTP_PORT', 25))
    MAIL_USE_TLS = get_boolean_env('FLASK_MAIL_USE_TLS', False)
    MAIL_USE_SSL = get_boolean_env('FLASK_MAIL_USE_SSL', False)
    MAIL_USERNAME = os.environ.get('MAILGUN_SMTP_LOGIN', None)
    MAIL_PASSWORD = os.environ.get('MAILGUN_SMTP_PASSWORD', None)
    MAIL_DEFAULT_SENDER = (
        os.environ.get('FLASK_MAIL_DEFAULT_SENDER_NAME', 'Cheddarr'),
        os.environ.get('FLASK_MAIL_DEFAULT_SENDER_EMAIL',
                       f"noreply@{os.environ.get('FLASK_DOMAIN', 'localhost')}")
    )

    ##########################################################################
    # oauth                                                                  #
    ##########################################################################
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    GOOGLE_AUTHORIZE_URL = os.environ.get('GOOGLE_AUTHORIZE_URL')
    FACEBOOK_CLIENT_ID = os.environ.get('FACEBOOK_CLIENT_ID')
    FACEBOOK_CLIENT_SECRET = os.environ.get('FACEBOOK_CLIENT_SECRET')
    FACEBOOK_AUTHORIZE_URL = os.environ.get('FACEBOOK_AUTHORIZE_URL')


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


class TestConfig(BaseConfig):
    FLASK_DOMAIN = "http://localhost"
    TESTING = True
    DEBUG = True
    SERVER_NAME = "127.0.0.1:5000"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False
