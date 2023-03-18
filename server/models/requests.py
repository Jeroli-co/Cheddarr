from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import (
    Enum as DBEnum,
)
from sqlalchemy import (
    ForeignKey,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.models.base import Model, Timestamp, intpk
from server.models.media import MediaType

if TYPE_CHECKING:
    from .media import Media
    from .settings import MediaProviderSetting
    from .users import User


class RequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    refused = "refused"
    available = "available"


class MediaRequest(Model, Timestamp):
    id: Mapped[intpk]
    media_type: Mapped[MediaType] = mapped_column(DBEnum(MediaType))
    status: Mapped[RequestStatus] = mapped_column(DBEnum(RequestStatus), default=RequestStatus.pending)
    comment: Mapped[str | None] = mapped_column(Text)
    root_folder: Mapped[str | None]
    quality_profile_id: Mapped[int | None]
    language_profile_id: Mapped[int | None]
    selected_provider_id: Mapped[int | None] = mapped_column(ForeignKey("media_provider_setting.id"))
    selected_provider: Mapped[MediaProviderSetting] = relationship(lazy="joined")
    requesting_user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    requesting_user: Mapped[User] = relationship(lazy="joined", foreign_keys=[requesting_user_id], repr=True)
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"))
    media: Mapped[Media] = relationship(lazy="joined", repr=True)

    season_requests: Mapped[list[SeasonRequest]] = relationship(
        primaryjoin="and_(MediaRequest.id == SeasonRequest.series_request_id,"
        f" MediaRequest.media_type == {MediaType.series})",
        cascade="all,delete,delete-orphan",
        lazy="selectin",
        back_populates="series_request",
    )


class SeasonRequest(Model):
    id: Mapped[intpk]
    season_number: Mapped[int] = mapped_column(repr=True)
    series_request_id: Mapped[int] = mapped_column(ForeignKey("media_request.id", ondelete="CASCADE"))
    series_request: Mapped[MediaRequest] = relationship(back_populates="season_requests")
    status: Mapped[RequestStatus] = mapped_column(DBEnum(RequestStatus), default=RequestStatus.pending)
    episode_requests: Mapped[list[EpisodeRequest]] = relationship(
        cascade="all,delete,delete-orphan",
        lazy="selectin",
        back_populates="season_request",
        repr=True,
    )


class EpisodeRequest(Model):
    id: Mapped[intpk]
    episode_number: Mapped[int] = mapped_column(repr=True)
    season_request_id: Mapped[int] = mapped_column(ForeignKey("season_request.id", ondelete="CASCADE"))
    season_request: Mapped[SeasonRequest] = relationship(back_populates="episode_requests")
    status: Mapped[RequestStatus] = mapped_column(DBEnum(RequestStatus), default=RequestStatus.pending)
