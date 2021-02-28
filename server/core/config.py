import secrets
from datetime import datetime
from json import dump, load
from pathlib import Path
from typing import List

from pydantic import (
    AnyHttpUrl,
    BaseSettings,
    DirectoryPath,
)


class Config(BaseSettings):

    ##########################################################################
    # server                                                                 #
    ##########################################################################
    API_PREFIX: str = "/api"
    DOMAIN: str = "localhost:9090"
    SERVER_HOST: str = f"http://{DOMAIN}"
    LOG_LEVEL: str = "INFO"
    TIMEZONE: str = datetime.now().astimezone().tzname()

    ##########################################################################
    # folders/files                                                          #
    ##########################################################################
    PROJECT_ROOT: DirectoryPath = Path(__file__).parents[2].resolve()
    REACT_BUILD_FOLDER: DirectoryPath = PROJECT_ROOT / "client" / "build"
    REACT_STATIC_FOLDER: DirectoryPath = PROJECT_ROOT / "client" / "build" / "static"
    MAIL_TEMPLATES_FOLDER: DirectoryPath = PROJECT_ROOT / "server" / "templates"
    IMAGES_FOLDER: DirectoryPath = PROJECT_ROOT / "server" / "static" / "images"
    CONFIG_FOLDER: Path = PROJECT_ROOT / "config"
    LOGS_FOLDER: Path = CONFIG_FOLDER / "logs"
    DB_FOLDER: Path = CONFIG_FOLDER / "db"
    CONFIG_FILE: Path = CONFIG_FOLDER / "config.json"

    ##########################################################################
    # external services                                                      #
    ##########################################################################
    PLEX_CLIENT_IDENTIFIER: str = secrets.token_urlsafe(16)
    PLEX_TOKEN_URL: AnyHttpUrl = "https://plex.tv/api/v2/pins/"
    PLEX_AUTHORIZE_URL: AnyHttpUrl = "https://app.plex.tv/auth#/"
    PLEX_USER_RESOURCE_URL: AnyHttpUrl = "https://plex.tv/api/v2/user/"
    TMDB_API_KEY: str = "cd210007bbc918ea3995df599405935b"

    ##########################################################################
    # security                                                               #
    ##########################################################################
    SECRET_KEY: str = secrets.token_urlsafe(32)
    SIGNING_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 3
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    ##########################################################################
    # database                                                               #
    ##########################################################################
    DB_NAME: str = "cheddarr.sqlite"
    DB_URL: str = "sqlite:///" + str(DB_FOLDER / DB_NAME)
    DB_OPTIONS: dict = {"check_same_thread": False}

    ##########################################################################
    # notifications                                                          #
    ##########################################################################
    MAIL_ENABLED: bool = False

    ##########################################################################

    def setup(self):
        try:
            with open(self.CONFIG_FILE, "r") as existing_config_file:
                existing_config = load(existing_config_file)
                for k, v in existing_config.items():
                    setattr(self, k.upper(), v)
        except FileNotFoundError:
            pass
        try:
            self.write_file()
        except OSError:
            raise

    def set(self, **config_kwargs):
        for field_k, field_v in config_kwargs.items():
            if field_k in self.__fields__:
                setattr(self, field_k, field_v)
        self.write_file()

    def write_file(self):
        with open(self.CONFIG_FILE, "w+") as config_file:
            dump(
                {
                    item.lower(): getattr(self, item)
                    for item in self.__fields__
                    if item in self._config_file_fields
                },
                config_file,
            )

    _config_file_fields = {"SECRET_KEY", "LOG_LEVEL", "MAIL_ENABLED", "TIMEZONE"}


config = Config()
