import json
import secrets
from pathlib import Path
from typing import List
from uuid import uuid4

from cachetools.func import lru_cache
from pydantic import (
    AnyHttpUrl,
    BaseSettings,
    DirectoryPath,
)
from tzlocal import get_localzone


class Config(BaseSettings):

    ##########################################################################
    # server                                                                 #
    ##########################################################################
    api_prefix: str = "/api"
    server_domain: str = "localhost"
    server_port: int = 9090
    server_host: str = f"http://{server_domain}:{server_port}"
    log_level: str = "INFO"
    tz: str = get_localzone().zone

    ##########################################################################
    # folders/files                                                          #
    ##########################################################################
    project_root: DirectoryPath = Path(__file__).parents[2].resolve()
    react_build_folder: DirectoryPath = project_root / "client" / "build"
    react_static_folder: DirectoryPath = project_root / "client" / "build" / "static"
    mail_templates_folder: DirectoryPath = project_root / "server" / "templates"
    images_folder: DirectoryPath = project_root / "server" / "static" / "images"
    config_folder: Path = project_root / "config"
    logs_folder: Path = config_folder / "logs"
    logs_filename: str = "cheddarr.log"
    logs_max_files: int = 10
    db_folder: Path = config_folder / "db"
    config_filename: Path = config_folder / "config.json"

    ##########################################################################
    # external services                                                      #
    ##########################################################################
    plex_token_url: AnyHttpUrl = "https://plex.tv/api/v2/pins/"
    plex_authorize_url: AnyHttpUrl = "https://app.plex.tv/auth#/"
    plex_user_resource_url: AnyHttpUrl = "https://plex.tv/api/v2/user/"
    tmdb_api_key: str = "cd210007bbc918ea3995df599405935b"

    ##########################################################################
    # security                                                               #
    ##########################################################################
    client_id: str = uuid4().hex
    secret_key: str = secrets.token_urlsafe(32)
    signing_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 3
    backend_cors_origin: List[AnyHttpUrl] = [server_host]
    default_roles: int = 4

    ##########################################################################
    # database                                                               #
    ##########################################################################
    db_filename: str = "cheddarr.sqlite"
    db_url: str = "sqlite+aiosqlite:///" + str(db_folder / db_filename)

    ##########################################################################
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.db_folder.mkdir(parents=True, exist_ok=True)
        self.logs_folder.mkdir(parents=True, exist_ok=True)
        self.setup()

    def setup(self):
        try:
            for k, v in self.read_file():
                setattr(self, k, v)
        except FileNotFoundError:
            pass
        try:
            self.write_file()
        except OSError:
            raise

    def read_file(self) -> dict:
        with open(self.config_filename, "r") as config_file:
            config = json.load(config_file)
            return config.items()

    def update(self, **config_kwargs):
        for field_k, field_v in config_kwargs.items():
            if field_k in self.__fields__ and field_v is not None:
                setattr(self, field_k, field_v)
        self.write_file()
        get_config.cache_clear()

    def write_file(self):
        with open(self.config_filename, "w+") as config_file:
            json.dump(
                {
                    item: getattr(self, item)
                    for item in self.__fields__
                    if item in self._file_config_fields
                },
                config_file,
                indent=2,
                sort_keys=True,
            )

    _file_config_fields = {
        "secret_key",
        "client_id",
        "log_level",
        "default_roles",
    }


@lru_cache()
def get_config():
    return Config()
