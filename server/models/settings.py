from __future__ import annotations

from enum import Enum
from typing import Any
from uuid import uuid4

from sqlalchemy import Enum as DBEnum
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, declarative_mixin, mapped_column, relationship

from server.models.base import Model, intpk, mapper_args


class ExternalServiceName(str, Enum):
    plex = "Plex"
    radarr = "Radarr"
    sonarr = "Sonarr"


class MediaProviderType(str, Enum):
    movie_provider = "movies_provider"
    series_provider = "series_provider"


@declarative_mixin
class ExternalServiceSetting:
    @staticmethod
    def default_name(context) -> str:
        return context.get_current_parameters()["service_name"]

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: uuid4().hex)
    api_key: Mapped[str]
    host: Mapped[str] = mapped_column(repr=True)
    port: Mapped[int | None] = mapped_column(repr=True)
    ssl: Mapped[bool] = mapped_column(default=False, repr=True)
    enabled: Mapped[bool] = mapped_column(default=True, repr=True)
    service_name: Mapped[str] = mapped_column(repr=True)
    name: Mapped[str] = mapped_column(default=default_name)


class MediaServerSetting(Model, ExternalServiceSetting):
    __mapper_args__ = mapper_args({"polymorphic_abstract": True, "polymorphic_on": "service_name"})

    server_id: Mapped[str] = mapped_column(unique=True)
    server_name: Mapped[str]
    libraries: Mapped[list[MediaServerLibrary]] = relationship(
        lazy="selectin",
        cascade="all,delete,delete-orphan",
        passive_deletes=True,
    )


class MediaServerLibrary(Model):
    id: Mapped[intpk]
    library_id: Mapped[str]
    name: Mapped[int] = mapped_column(repr=True)
    setting_id: Mapped[int] = mapped_column(ForeignKey("media_server_setting.id", ondelete="CASCADE"))


class PlexSetting(MediaServerSetting):
    __tablename__ = None  # Single table inheritance with `.MediaServerSetting`
    __mapper_args__ = mapper_args({"polymorphic_identity": ExternalServiceName.plex})


class MediaProviderSetting(Model, ExternalServiceSetting):
    __mapper_args__ = mapper_args({"polymorphic_abstract": True, "polymorphic_on": "service_name"})

    provider_type: Mapped[MediaProviderType] = mapped_column(DBEnum(MediaProviderType))
    root_folder: Mapped[str]
    quality_profile_id: Mapped[int | None]
    language_profile_id: Mapped[int | None]
    version: Mapped[int | None]
    is_default: Mapped[bool] = mapped_column(default=False)


class RadarrSetting(MediaProviderSetting):
    __tablename__ = None  # Single table inheritance with `.MediaProviderSetting`
    __mapper_args__ = mapper_args({"polymorphic_identity": ExternalServiceName.radarr})

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.provider_type = MediaProviderType.movie_provider


class SonarrSetting(MediaProviderSetting):
    __tablename__ = None  # Single table inheritance with `.MediaProviderSetting`
    __mapper_args__ = mapper_args({"polymorphic_identity": ExternalServiceName.sonarr})

    anime_root_folder: Mapped[str]
    anime_quality_profile_id: Mapped[int | None]
    anime_language_profile_id: Mapped[int | None]

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.provider_type = MediaProviderType.series_provider
