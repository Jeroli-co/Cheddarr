from __future__ import annotations

from enum import Enum

from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Column,
    Enum as DBEnum,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import backref, relationship
from sqlalchemy_utils import Timestamp

from server.database import Model

if TYPE_CHECKING:
    from . import User  # noqa


class MovieRequest(Model, Timestamp):
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer, nullable=False)
    approved = Column(Boolean, default=False)
    refused = Column(Boolean, default=False)
    available = Column(Boolean, default=False)
    requested_user_id = Column(ForeignKey("user.id"), nullable=False)
    requesting_user_id = Column(ForeignKey("user.id"), nullable=False)
    requested_user = relationship(
        "User",
        foreign_keys=[requested_user_id],
        backref=backref("received_movies_requests", cascade="all,delete", lazy=True),
    )
    requesting_user = relationship(
        "User",
        foreign_keys=[requesting_user_id],
        backref=backref("sent_movies_requests", cascade="all,delete", lazy=True),
    )
    UniqueConstraint(requested_user_id, requesting_user_id, tmdb_id)

    __repr_props__ = ("tmdb_id", "requested_user", "requesting_user_id")


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class SeriesRequest(Model):
    id = Column(Integer, primary_key=True)
    tvdb_id = Column(Integer, nullable=False)
    series_type = Column(DBEnum(SeriesType), nullable=False)
    requested_user_id = Column(ForeignKey("user.id"), nullable=False)
    requested_user = relationship(
        "User",
        foreign_keys=[requested_user_id],
        backref=backref("received_series_requests", cascade="all,delete", lazy=True),
    )
    children = relationship(
        "SeriesChildRequest",
        cascade="all,delete,delete-orphan",
        back_populates="parent",
    )
    UniqueConstraint(requested_user_id, tvdb_id)

    __repr_props__ = ("tvdb_id", "requested_user", "children")


class SeriesChildRequest(Model, Timestamp):
    id = Column(Integer, primary_key=True)
    approved = Column(Boolean, default=False)
    refused = Column(Boolean, default=False)
    series_id = Column(ForeignKey("seriesrequest.id"), nullable=False)
    selected_provider_id = Column(ForeignKey("providerconfig.id"), nullable=False)
    requesting_user_id = Column(ForeignKey("user.id"), nullable=False)
    requesting_user = relationship(
        "User",
        foreign_keys=[requesting_user_id],
        backref=backref("sent_series_requests", cascade="all,delete", lazy=True),
    )
    parent = relationship("SeriesRequest", back_populates="children")
    seasons = relationship(
        "SeasonRequest", cascade="all,delete,delete-orphan", backref="series_child"
    )

    __repr_props__ = (
        "requesting_user",
        "requested_date",
        "response_date",
        "approved",
        "refused",
        "seasons",
    )


class SeasonRequest(Model):
    id = Column(Integer, primary_key=True)
    season_number = Column(Integer, nullable=False)
    series_child_id = Column(ForeignKey("serieschildrequest.id"), nullable=False)
    episodes = relationship(
        "EpisodeRequest", cascade="all,delete,delete-orphan", backref="season"
    )

    __repr_props__ = (
        "season_number",
        "episodes",
    )


class EpisodeRequest(Model):
    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer, nullable=False)
    available = Column(Boolean, default=False)
    season_id = Column(ForeignKey("seasonrequest.id"), nullable=False)

    __repr_props__ = ("episode_number", "available")
