import secrets
from pathlib import Path
from typing import Any
from uuid import uuid4

from cachetools.func import lru_cache
from pydantic import (
    AnyHttpUrl,
    BaseModel,
    BaseSettings,
    DirectoryPath,
    parse_file_as,
    parse_obj_as,
)


class CustomConfig(BaseSettings, validate_all=True, validate_assignment=True, extra="forbid"):
    server_domain: str | None
    enable_https: bool | None
    server_port: int | None
    secret_key: str | None
    client_id: str | None
    log_level: str | None
    tz: str | None
    default_roles: int | None
    tmdb_api_key: str | None


class Config(BaseModel):
    ##########################################################################
    # server                                                                 #
    ##########################################################################
    server_domain: str = "localhost"
    server_port: int = 9090
    server_host: str = f"http://{server_domain}"
    log_level: str = "INFO"
    tz: str = "UTC"

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
    plex_token_url: AnyHttpUrl = parse_obj_as(AnyHttpUrl, "https://plex.tv/api/v2/pins/")
    plex_authorize_url: AnyHttpUrl = parse_obj_as(AnyHttpUrl, "https://app.plex.tv/auth#/")
    plex_user_resource_url: AnyHttpUrl = parse_obj_as(AnyHttpUrl, "https://plex.tv/api/v2/user/")
    tmdb_api_key: str = "cd210007bbc918ea3995df599405935b"

    ##########################################################################
    # security                                                               #
    ##########################################################################
    client_id: str = uuid4().hex
    secret_key: str = secrets.token_urlsafe(32)
    signing_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 3
    backend_cors_origin: list[str] = [str(server_host)]
    default_roles: int = 4
    signup_enabled: bool = True
    local_account_enabled: bool = True

    ##########################################################################
    # database                                                               #
    ##########################################################################
    db_filename: str = "cheddarr.sqlite"
    db_uri: str = "sqlite+aiosqlite:///" + str(db_folder / db_filename)

    ##########################################################################

    def setup(self) -> None:
        for k, v in CustomConfig().dict(exclude_none=True, exclude_unset=True).items():
            setattr(self, k, v)
        self.db_folder.mkdir(parents=True, exist_ok=True)
        self.logs_folder.mkdir(parents=True, exist_ok=True)
        for k, v in self.read_file().items():
            setattr(self, k, v)
        try:
            self.write_file()
        except OSError:
            raise

    def read_file(self) -> dict[str, Any]:
        if not Path(self.config_filename).is_file() or Path(self.config_filename).stat().st_size == 0:
            return {}
        return parse_file_as(type_=CustomConfig, path=self.config_filename).dict(exclude_none=True, exclude_unset=True)

    def write_file(self) -> None:
        with Path(self.config_filename).open("w+") as config_file:
            config_file.write(
                self.json(
                    include=CustomConfig.__fields__.keys(),
                    indent=2,
                    sort_keys=True,
                ),
            )

    def update(self, **config_kwargs: Any) -> None:
        for field_k, field_v in config_kwargs.items():
            if field_k in self.__fields__ and field_v is not None:
                setattr(self, field_k, field_v)
        self.write_file()
        get_config.cache_clear()  # type: ignore


class TestConfig(Config):
    db_uri: str = "sqlite+aiosqlite://"
    secret_key: str = "test"


@lru_cache()
def get_config() -> Config:
    return Config()


def get_test_config() -> TestConfig:
    return TestConfig()
