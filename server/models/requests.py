from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import (
    Column,
    Enum as DBEnum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import declared_attr, Mapped, relationship

from server.models.media import MediaType
from .base import mapper_args, Model, Timestamp

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
    __mapper_args__ = mapper_args({"polymorphic_on": "media_type", "with_polymorphic": "*"})

    id = Column(Integer, primary_key=True)
    media_type = Column(DBEnum(MediaType), nullable=False)
    status = Column(DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending)
    comment = Column(Text)
    root_folder = Column(String)
    quality_profile_id = Column(Integer)
    language_profile_id = Column(Integer)

    @declared_attr
    def selected_provider_id(cls) -> Mapped[int]:
        return Column(ForeignKey("mediaprovidersetting.id"))

    @declared_attr
    def selected_provider(cls) -> Mapped["MediaProviderSetting"]:
        return relationship("MediaProviderSetting", lazy="joined")

    @declared_attr
    def requesting_user_id(cls) -> Mapped[int]:
        return Column(ForeignKey("user.id"), nullable=False)

    @declared_attr
    def requesting_user(cls) -> Mapped["User"]:
        return relationship("User", lazy="joined", foreign_keys=cls.requesting_user_id)

    @declared_attr
    def media_id(cls) -> Mapped[int]:
        return Column(ForeignKey("media.id"), nullable=False)

    @declared_attr
    def media(cls) -> Mapped["Media"]:
        return relationship("Media", lazy="joined")


class MovieRequest(MediaRequest):
    __tablename__ = None
    __mapper_args__ = mapper_args({"polymorphic_identity": MediaType.movie})
    __repr_props__ = ("media", "requested_user", "requesting_user")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class SeriesRequest(MediaRequest):
    __tablename__ = None
    __mapper_args__ = mapper_args({"polymorphic_identity": MediaType.series})
    __repr_props__ = ("media", "requested_user", "requesting_user")

    seasons: list["SeasonRequest"] = relationship(
        "SeasonRequest", cascade="all,delete,delete-orphan", lazy="selectin", backref="request"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class SeasonRequest(Model):
    __repr_props__ = ("season_number", "episodes")

    id = Column(Integer, primary_key=True)
    season_number = Column(Integer, nullable=False)
    series_request_id: int = Column(ForeignKey("mediarequest.id"), nullable=False)
    status = Column(DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending)
    episodes: list["EpisodeRequest"] = relationship(
        "EpisodeRequest", cascade="all,delete,delete-orphan", lazy="selectin", backref="season"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class EpisodeRequest(Model):
    __repr_props__ = ("episode_number", "available")

    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer, nullable=False)
    season_request_id: int = Column(ForeignKey("seasonrequest.id"), nullable=False)
    status = Column(DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
