from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, MappedAsDataclass, declarative_mixin, declared_attr, mapped_column, relationship

from server.models.base import Model

if TYPE_CHECKING:
    from server.models.settings import MediaServerSetting


class MediaType(StrEnum):
    movie = "movies"
    series = "series"


class SeriesType(StrEnum):
    anime = "anime"
    standard = "standard"


class Media(Model):
    __table_args__ = (
        UniqueConstraint("tmdb_id", "media_type"),
        UniqueConstraint("imdb_id", "media_type"),
        UniqueConstraint("tvdb_id", "media_type"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, init=False, default=None)
    tmdb_id: Mapped[int | None] = mapped_column(repr=True)
    imdb_id: Mapped[str | None] = mapped_column(repr=True)
    tvdb_id: Mapped[int | None] = mapped_column(repr=True)
    title: Mapped[str] = mapped_column(repr=True)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType), repr=True)


@declarative_mixin
class MediaServerContent(MappedAsDataclass):
    id: Mapped[int] = mapped_column(primary_key=True, init=False, default=None)
    server_id: Mapped[str] = mapped_column(ForeignKey("media_server_setting.server_id"))
    external_id: Mapped[str] = mapped_column(unique=True)
    added_at: Mapped[datetime | None] = mapped_column()

    @declared_attr
    def server(self) -> Mapped[MediaServerSetting]:
        return relationship(lazy="selectin", innerjoin=True, repr=True, init=False)


class MediaServerMedia(Model, MediaServerContent):
    server_library_id: Mapped[str] = mapped_column(ForeignKey("media_server_library.id", ondelete="CASCADE"))
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id", ondelete="CASCADE"))
    media: Mapped[Media] = relationship(lazy="selectin", innerjoin=True, repr=True)


class MediaServerSeason(Model, MediaServerContent):
    season_number: Mapped[int] = mapped_column(repr=True)
    server_media_id: Mapped[int] = mapped_column(ForeignKey("media_server_media.id", ondelete="CASCADE"), init=False)
    server_media: Mapped[MediaServerMedia] = relationship(lazy="selectin", innerjoin=True, init=False)


class MediaServerEpisode(Model, MediaServerContent):
    episode_number: Mapped[int] = mapped_column(repr=True)
    season_id: Mapped[int] = mapped_column(ForeignKey("media_server_season.id", ondelete="CASCADE"), init=False)
    season: Mapped[MediaServerSeason] = relationship(lazy="selectin", innerjoin=True, init=False)
