import secrets
from enum import Enum
from typing import List, Optional, Tuple, Union
from pathlib import Path

from pydantic import (
    AnyHttpUrl,
    AnyUrl,
    BaseSettings,
)

PROJECT_ROOT = Path(__file__).parents[2].resolve()


class Environment(str, Enum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"


class Settings(BaseSettings):
    class Config:
        env_file = PROJECT_ROOT / ".env"
        case_sensitive = True

    APP_NAME = "Cheddarr"
    ENV: Environment = Environment.DEVELOPMENT

    ##########################################################################
    # server                                                                    #
    ##########################################################################
    API_VERSION = "0.1"
    API_PREFIX: str = "/api"
    DOMAIN: str = None

    ##########################################################################
    # folders                                                                #
    ##########################################################################
    REACT_BUILD_FOLDER = PROJECT_ROOT / "client" / "build"
    REACT_STATIC_FOLDER = PROJECT_ROOT / "client" / "build" / "static"
    MAIL_TEMPLATES_FOLDER = PROJECT_ROOT / "server" / "templates"
    IMAGES_FOLDER = PROJECT_ROOT / "server" / "static" / "images"

    ##########################################################################
    # external services                                                          #
    ##########################################################################
    PLEX_CLIENT_IDENTIFIER: str = APP_NAME
    PLEX_TOKEN_URL: AnyHttpUrl = "https://plex.tv/api/v2/pins/"
    PLEX_AUTHORIZE_URL: AnyHttpUrl = "https://app.plex.tv/auth#/"
    PLEX_USER_RESOURCE_URL: AnyHttpUrl = "https://plex.tv/api/v2/user/"
    PLEXAPI_ENABLE_FAST_CONNECT = True
    TMDB_API_KEY: str

    ##########################################################################
    # security                                                               #
    ##########################################################################
    SECRET_KEY: str = secrets.token_urlsafe(32)
    SIGNING_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 3
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    DATABASE_OPTIONS: dict = {}

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_SMTP_PORT: Optional[int]
    MAIL_SMTP_HOST: Optional[str]
    MAIL_SMTP_USER: Optional[str]
    MAIL_SMTP_PASSWORD: Optional[str]


class ProdSettings(Settings):
    ##########################################################################
    # server                                                                    #
    ##########################################################################
    DOMAIN: Optional[str] = None
    HEROKU_APP_NAME: Optional[str] = None
    SERVER_HOST: AnyHttpUrl = "https://%s" % (
        DOMAIN or f"{HEROKU_APP_NAME}.herokuapp.com"
    )
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [SERVER_HOST]

    ##########################################################################
    # database                                                               #
    ##########################################################################
    DATABASE_URL: AnyUrl

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_ENABLED: bool = True
    MAIL_DEFAULT_SENDER: Tuple[str, str] = (
        f"noreply@{DOMAIN}",
        "Cheddarr",
    )


class DevSettings(Settings):
    ##########################################################################
    # server                                                                 #
    ##########################################################################
    DOMAIN: str = "localhost:8000"
    SERVER_HOST: str = f"http://{DOMAIN}"

    ##########################################################################
    # database                                                               #
    ##########################################################################
    DATABASE_URL: str = "sqlite:///" + str(PROJECT_ROOT / "dev.db")
    DATABASE_OPTIONS: dict = {"check_same_thread": False}

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_ENABLED: bool = False


class FactorySettings:
    """Returns a Settings instance dependending on the ENV variable."""

    def __init__(self, env: Environment):
        self.env = env

    def __call__(self):
        if self.env == Environment.PRODUCTION:
            return ProdSettings()
        elif self.env == Environment.DEVELOPMENT:
            return DevSettings()


settings: Union[ProdSettings, DevSettings] = FactorySettings(Settings().ENV)()
