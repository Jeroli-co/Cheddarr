from __future__ import annotations

from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import (
    Enum,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.models.base import Model, Timestamp
from server.models.media import Media, MediaType

if TYPE_CHECKING:
    from server.models.settings import MediaProviderSetting
    from server.models.users import User


class RequestStatus(StrEnum):
    pending = "pending"
    approved = "approved"
    refused = "refused"
    available = "available"


class MediaRequest(Model, Timestamp):
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    media_type: Mapped[MediaType] = mapped_column(Enum(MediaType))
    media_id: Mapped[int] = mapped_column(ForeignKey("media.id"))
    requesting_user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    selected_provider_id: Mapped[int | None] = mapped_column(ForeignKey("media_provider_setting.id"), default=None)
    comment: Mapped[str | None] = mapped_column(Text, default=None)
    root_folder: Mapped[str | None] = mapped_column(default=None)
    quality_profile_id: Mapped[int | None] = mapped_column(default=None)
    _tags: Mapped[str | None] = mapped_column(default=None, name="tags")
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus), default=RequestStatus.pending)
    selected_provider: Mapped[MediaProviderSetting] = relationship(lazy="joined", init=False)
    requesting_user: Mapped[User] = relationship(
        lazy="joined",
        foreign_keys=[requesting_user_id],
        init=False,
        repr=True,
    )
    media: Mapped[Media] = relationship(lazy="joined", init=False, repr=True)
    season_requests: Mapped[list[SeasonRequest]] = relationship(
        cascade="all,delete,delete-orphan",
        lazy="selectin",
        back_populates="media_request",
        init=False,
        default_factory=list,
    )

    @property
    def tags(self) -> list[str]:
        if self._tags is None:
            return []
        return self._tags.split(",")

    @tags.setter
    def tags(self, value: list[int]) -> None:
        self._tags = ",".join(str(v) for v in value)


class SeasonRequest(Model):
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    season_number: Mapped[int] = mapped_column(repr=True)
    series_request_id: Mapped[int] = mapped_column(ForeignKey("media_request.id", ondelete="CASCADE"), init=False)
    media_request: Mapped[MediaRequest] = relationship(lazy="selectin", back_populates="season_requests", init=False)
    episode_requests: Mapped[list[EpisodeRequest]] = relationship(
        cascade="all,delete,delete-orphan",
        lazy="selectin",
        back_populates="season_request",
        init=False,
        default_factory=list,
    )
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus), default=RequestStatus.pending)


class EpisodeRequest(Model):
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    episode_number: Mapped[int] = mapped_column(repr=True)
    season_request_id: Mapped[int] = mapped_column(ForeignKey("season_request.id", ondelete="CASCADE"), init=False)
    season_request: Mapped[SeasonRequest] = relationship(lazy="selectin", back_populates="episode_requests", init=False)
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus), default=RequestStatus.pending)
