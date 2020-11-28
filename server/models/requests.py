from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    Enum as DBEnum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.database import Model, Timestamp
from server.models.types import SeriesType


class Media(object):
    __repr_props__ = ("title",)

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    poster_url = Column(String)
    art_url = Column(String)
    release_date = Column(Date)
    status = Column(String)


class Movie(Model, Media):
    tmdb_id = Column(Integer, unique=True, index=True)
    requests = relationship("MovieRequest")


class Series(Model, Media):
    tvdb_id = Column(Integer, nullable=False)
    number_of_seasons = Column(Integer)
    requests = relationship("SeriesRequest", back_populates="series")


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
    series_type = Column(DBEnum(SeriesType), nullable=False)
    seasons = relationship(
        "SeasonRequest", cascade="all,delete,delete-orphan", backref="request"
    )


class SeasonRequest(Model):
    __repr_props__ = ("season_number", "episodes")

    id = Column(Integer, primary_key=True)
    season_number = Column(Integer, nullable=False)
    series_request_id = Column(ForeignKey("seriesrequest.id"), nullable=False)
    episodes = relationship(
        "EpisodeRequest", cascade="all,delete,delete-orphan", backref="season"
    )


class EpisodeRequest(Model):
    __repr_props__ = ("episode_number", "available")

    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer, nullable=False)
    release_date = Column(Date)
    season_request_id = Column(ForeignKey("seasonrequest.id"), nullable=False)
