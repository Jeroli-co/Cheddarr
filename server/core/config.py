import secrets
from enum import Enum
from pathlib import Path
from typing import Optional, Tuple, Union

from dotenv import load_dotenv
from pydantic import (
    AnyHttpUrl,
    AnyUrl,
    BaseSettings,
    DirectoryPath,
)

PROJECT_ROOT: DirectoryPath = Path(__file__).parents[2].resolve()


class Environment(str, Enum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"


class BaseConfig(BaseSettings):

    APP_NAME: str = "Cheddarr"
    ENV: Environment = Environment.DEVELOPMENT

    ##########################################################################
    # server                                                                 #
    ##########################################################################
    API_VERSION: str = "0.1"
    API_PREFIX: str = "/api"
    DOMAIN: str = "localhost:8000"
    SERVER_HOST: str = f"http://{DOMAIN}"

    ##########################################################################
    # folders                                                                #
    ##########################################################################
    REACT_BUILD_FOLDER: DirectoryPath = PROJECT_ROOT / "client" / "build"
    REACT_STATIC_FOLDER: DirectoryPath = PROJECT_ROOT / "client" / "build" / "static"
    MAIL_TEMPLATES_FOLDER: DirectoryPath = PROJECT_ROOT / "server" / "templates"
    IMAGES_FOLDER: DirectoryPath = PROJECT_ROOT / "server" / "static" / "images"

    ##########################################################################
    # external services                                                      #
    ##########################################################################
    PLEX_CLIENT_IDENTIFIER: str = APP_NAME
    PLEX_TOKEN_URL: AnyHttpUrl = "https://plex.tv/api/v2/pins/"
    PLEX_AUTHORIZE_URL: AnyHttpUrl = "https://app.plex.tv/auth#/"
    PLEX_USER_RESOURCE_URL: AnyHttpUrl = "https://plex.tv/api/v2/user/"
    TMDB_API_KEY: str = None

    ##########################################################################
    # security                                                               #
    ##########################################################################
    SECRET_KEY: str = secrets.token_urlsafe(32)
    SIGNING_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 3
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

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
    MAIL_DEFAULT_SENDER: Tuple[str, str] = (
        f"noreply@{DOMAIN}",
        "Cheddarr",
    )


class ProdConfig(BaseConfig):
    ##########################################################################
    # server                                                                 #
    ##########################################################################
    DOMAIN: Optional[str] = None
    HEROKU_APP_NAME: Optional[str] = None
    SERVER_HOST: AnyHttpUrl = "https://%s" % (
        DOMAIN or f"{HEROKU_APP_NAME}.herokuapp.com"
    )
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = [SERVER_HOST]

    ##########################################################################
    # database                                                               #
    ##########################################################################
    DATABASE_URL: AnyUrl

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_ENABLED: bool = True


class DevConfig(BaseConfig):
    class Config:
        env_file = PROJECT_ROOT / ".env"
        case_sensitive = True

    ##########################################################################
    # database                                                               #
    ##########################################################################
    DATABASE_URL: str = "sqlite:///" + str(PROJECT_ROOT / "dev.db")
    DATABASE_OPTIONS: dict = {"check_same_thread": False}

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_ENABLED: bool = False


class FactoryConfig:
    """Returns a Settings instance dependending on the ENV variable."""

    def __init__(self, env: Environment):
        self.env = env

    def __call__(self):
        if self.env == Environment.PRODUCTION:
            return ProdConfig()
        elif self.env == Environment.DEVELOPMENT:
            load_dotenv(PROJECT_ROOT / ".env")
            return DevConfig()


settings: Union[ProdConfig, DevConfig] = FactoryConfig(BaseConfig().ENV)()
