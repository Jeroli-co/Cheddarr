from enum import Enum

from sqlalchemy import (
    Column,
    Enum as DBEnum,
    ForeignKey,
    Integer,
    Text,
)
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.database import Model, Timestamp
from server.models.media import MediaType


class RequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    refused = "refused"
    available = "available"


class MediaRequest(Model, Timestamp):
    __mapper_args__ = {"polymorphic_on": "media_type"}

    id = Column(Integer, primary_key=True)
    media_type = Column(DBEnum(MediaType), nullable=False)
    status = Column(DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending)
    comment = Column(Text)

    @declared_attr
    def selected_provider_id(cls):
        return Column(ForeignKey("mediaprovidersetting.id"))

    @declared_attr
    def selected_provider(cls):
        return relationship("MediaProviderSetting")

    @declared_attr
    def requesting_user_id(cls):
        return Column(ForeignKey("user.id"), nullable=False)

    @declared_attr
    def requesting_user(cls):
        return relationship("User", foreign_keys=cls.requesting_user_id)

    @declared_attr
    def requested_user_id(cls):
        return Column(ForeignKey("user.id"), nullable=False)

    @declared_attr
    def requested_user(cls):
        return relationship("User", foreign_keys=cls.requested_user_id)

    @declared_attr
    def media_id(cls):
        return Column(ForeignKey("media.id"), nullable=False)

    @declared_attr
    def media(cls):
        return relationship("Media")


class MovieRequest(MediaRequest):
    __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": MediaType.movie}
    __repr_props__ = ("media", "requested_user", "requesting_user")


class SeriesRequest(MediaRequest):
    __tablename__ = None
    __mapper_args__ = {"polymorphic_identity": MediaType.series}
    __repr_props__ = ("media", "requested_user", "requesting_user")

    seasons: list = relationship(
        "SeasonRequest", cascade="all,delete,delete-orphan", backref="request"
    )


class SeasonRequest(Model):
    __repr_props__ = ("season_number", "episodes")

    id = Column(Integer, primary_key=True)
    season_number = Column(Integer, nullable=False)
    series_request_id = Column(ForeignKey("mediarequest.id"), nullable=False)
    status = Column(DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending)

    episodes: list = relationship(
        "EpisodeRequest", cascade="all,delete,delete-orphan", backref="season"
    )


class EpisodeRequest(Model):
    __repr_props__ = ("episode_number", "available")

    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer, nullable=False)
    season_request_id = Column(ForeignKey("seasonrequest.id"), nullable=False)
    status = Column(DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending)
