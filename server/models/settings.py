from __future__ import annotations

from enum import StrEnum
from uuid import uuid4

from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, MappedAsDataclass, declarative_mixin, mapped_column, relationship

from server.models.base import Model, mapper_args


class ExternalServiceName(StrEnum):
    plex = "Plex"
    radarr = "Radarr"
    sonarr = "Sonarr"


class MediaProviderType(StrEnum):
    movie_provider = "movies_provider"
    series_provider = "series_provider"


@declarative_mixin
class ExternalServiceSetting(MappedAsDataclass):
    @staticmethod
    def default_name(context) -> str:
        return context.get_current_parameters()["service_name"]

    id: Mapped[str] = mapped_column(primary_key=True, init=False, default_factory=lambda: uuid4().hex)
    api_key: Mapped[str] = mapped_column()
    service_name: Mapped[str] = mapped_column(repr=True, init=False)
    host: Mapped[str] = mapped_column(repr=True)
    port: Mapped[int | None] = mapped_column(repr=True)
    name: Mapped[str] = mapped_column(insert_default=default_name)
    ssl: Mapped[bool] = mapped_column(insert_default=False, repr=True)
    enabled: Mapped[bool] = mapped_column(insert_default=True, repr=True)


class MediaServerLibrary(Model):
    id: Mapped[int] = mapped_column(primary_key=True, init=False, default=None)
    setting_id: Mapped[int] = mapped_column(ForeignKey("media_server_setting.id", ondelete="CASCADE"), init=False)
    library_id: Mapped[str]
    name: Mapped[str] = mapped_column(repr=True)


class MediaServerSetting(Model, ExternalServiceSetting):
    __mapper_args__ = mapper_args({"polymorphic_abstract": True, "polymorphic_on": "service_name"})

    server_id: Mapped[str] = mapped_column(unique=True)
    server_name: Mapped[str] = mapped_column(repr=True)
    libraries: Mapped[list[MediaServerLibrary]] = relationship(
        lazy="selectin",
        cascade="all,delete,delete-orphan",
        passive_deletes=True,
        init=False,
    )


class PlexSetting(MediaServerSetting):
    __tablename__ = None  # Single table inheritance with `.MediaServerSetting`
    __mapper_args__ = mapper_args({"polymorphic_identity": ExternalServiceName.plex, "polymorphic_load": "inline"})


class MediaProviderSetting(Model, ExternalServiceSetting):
    __mapper_args__ = mapper_args({"polymorphic_abstract": True, "polymorphic_on": "service_name"})

    provider_type: Mapped[MediaProviderType] = mapped_column(Enum(MediaProviderType), init=False)
    root_folder: Mapped[str]
    quality_profile_id: Mapped[int | None]
    version: Mapped[int | None]
    is_default: Mapped[bool] = mapped_column(default=False)
    _tags: Mapped[str | None] = mapped_column(default=None, name="tags")

    @property
    def tags(self) -> list[str]:
        if self._tags is None:
            return []
        return self._tags.split(",")

    @tags.setter
    def tags(self, value: list[int]) -> None:
        self._tags = ",".join(str(v) for v in value)


class RadarrSetting(MediaProviderSetting):
    __tablename__ = None  # Single table inheritance with `.MediaProviderSetting`
    __mapper_args__ = mapper_args({"polymorphic_identity": ExternalServiceName.radarr, "polymorphic_load": "inline"})

    def __post_init__(self) -> None:
        self.provider_type = MediaProviderType.movie_provider


class SonarrSetting(MediaProviderSetting):
    __tablename__ = None  # Single table inheritance with `.MediaProviderSetting`
    __mapper_args__ = mapper_args({"polymorphic_identity": ExternalServiceName.sonarr, "polymorphic_load": "inline"})

    def __post_init__(self) -> None:
        self.provider_type = MediaProviderType.series_provider

    anime_root_folder: Mapped[str | None] = mapped_column(default=None)
    anime_quality_profile_id: Mapped[int | None] = mapped_column(default=None)
    _anime_tags: Mapped[str | None] = mapped_column(default=None, name="anime_tags")

    @property
    def anime_tags(self) -> list[str]:
        if self._anime_tags is None:
            return []
        return self._anime_tags.split(",")

    @anime_tags.setter
    def anime_tags(self, value: list[int]) -> None:
        self._anime_tags = ",".join(str(v) for v in value)
