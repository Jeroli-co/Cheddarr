from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Enum as DBEnum
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, declarative_mixin, mapped_column, relationship

from server.models.base import Model, intpk

if TYPE_CHECKING:
    from datetime import datetime

    from server.models.settings import MediaServerSetting


class MediaType(str, Enum):
    movie = "movies"
    series = "series"


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class Media(Model):
    __table_args__ = (
        UniqueConstraint("tmdb_id", "media_type"),
        UniqueConstraint("imdb_id", "media_type"),
        UniqueConstraint("tvdb_id", "media_type"),
    )

    id: Mapped[intpk]
    tmdb_id: Mapped[int | None] = mapped_column(repr=True)
    imdb_id: Mapped[str | None] = mapped_column(repr=True)
    tvdb_id: Mapped[int | None] = mapped_column(repr=True)
    title: Mapped[str] = mapped_column(repr=True)
    media_type: Mapped[MediaType] = mapped_column(DBEnum(MediaType), repr=True)


@declarative_mixin
class MediaServerContent:
    id: Mapped[intpk]
    external_id: Mapped[str] = mapped_column(unique=True)
    added_at: Mapped[datetime | None]
    server_id: Mapped[int] = mapped_column(ForeignKey("media_server_setting.server_id"), unique=True)


class MediaServerMedia(Model, MediaServerContent):
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id", ondelete="CASCADE"))
    media: Mapped[Media] = relationship(lazy="selectin", innerjoin=True, repr=True)
    server_library_id: Mapped[int] = mapped_column(ForeignKey("media_server_library.id", ondelete="CASCADE"))
    server: Mapped[MediaServerSetting] = relationship(lazy="selectin", innerjoin=True, repr=True)
    seasons: Mapped[list[MediaServerSeason] | None] = relationship(
        back_populates="server_media",
        cascade="all,delete,delete-orphan",
        passive_deletes=True,
    )


class MediaServerSeason(Model, MediaServerContent):
    season_number: Mapped[int] = mapped_column(repr=True)
    server_media_id: Mapped[int] = mapped_column(ForeignKey("media_server_media.id", ondelete="CASCADE"))
    server_media: Mapped[MediaServerMedia] = relationship(
        back_populates="seasons",
        lazy="selectin",
        innerjoin=True,
    )
    episodes: Mapped[list[MediaServerEpisode]] = relationship(
        back_populates="season",
        cascade="all,delete,delete-orphan",
        passive_deletes=True,
    )


class MediaServerEpisode(Model, MediaServerContent):
    episode_number: Mapped[int] = mapped_column(repr=True)
    season_id: Mapped[int] = mapped_column(ForeignKey("media_server_season.id", ondelete="CASCADE"))
    season: Mapped[MediaServerSeason] = relationship(lazy="selectin", innerjoin=True, back_populates="episodes")
