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


class RequestStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    refused = "refused"
    available = "available"


class Request(object):
    id = Column(Integer, primary_key=True)
    status = Column(
        DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending
    )
    comment = Column(Text)

    @declared_attr
    def selected_provider_id(cls):
        return Column(ForeignKey("providerconfig.id"))

    @declared_attr
    def requesting_user_id(cls):
        return Column(ForeignKey("user.id"), nullable=False)

    @declared_attr
    def requested_user_id(cls):
        return Column(ForeignKey("user.id"), nullable=False)

    @declared_attr
    def selected_provider(cls):
        return relationship("ProviderConfig")

    @declared_attr
    def requesting_user(cls):
        return relationship("User", foreign_keys=cls.requesting_user_id)

    @declared_attr
    def requested_user(cls):
        return relationship("User", foreign_keys=cls.requested_user_id)


class MovieRequest(Model, Timestamp, Request):
    __repr_props__ = ("movie", "requested_user", "requesting_user")

    movie_id = Column(ForeignKey("movie.id"), nullable=False)
    movie = relationship("Movie")


class SeriesRequest(Model, Timestamp, Request):
    __repr_props__ = ("series", "requested_user", "requesting_user")

    series_id = Column(ForeignKey("series.id"), nullable=False)
    series = relationship("Series", back_populates="requests")
    seasons = relationship(
        "SeasonRequest", cascade="all,delete,delete-orphan", backref="request"
    )


class SeasonRequest(Model):
    __repr_props__ = ("season_number", "episodes")

    id = Column(Integer, primary_key=True)
    season_number = Column(Integer, nullable=False)
    series_request_id = Column(ForeignKey("seriesrequest.id"), nullable=False)
    status = Column(
        DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending
    )

    episodes = relationship(
        "EpisodeRequest", cascade="all,delete,delete-orphan", backref="season"
    )


class EpisodeRequest(Model):
    __repr_props__ = ("episode_number", "available")

    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer, nullable=False)
    season_request_id = Column(ForeignKey("seasonrequest.id"), nullable=False)
    status = Column(
        DBEnum(RequestStatus), nullable=False, default=RequestStatus.pending
    )
