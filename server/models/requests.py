from datetime import date
from typing import TYPE_CHECKING, List

from server.database import (
    Model,
    Column,
    Integer,
    ForeignKey,
    relationship,
    backref,
    Date,
    Boolean,
    UniqueConstraint,
)

if TYPE_CHECKING:
    from . import User  # noqa


class MovieRequest(Model):
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    requested_date = Column(Date)
    response_date = Column(Date, nullable=True)
    approved = Column(Boolean, default=False)
    refused = Column(Boolean, default=False)
    available = Column(Boolean, default=False)
    requested_user_id = Column(ForeignKey("user.id"))
    requesting_user_id = Column(ForeignKey("user.id"))
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

    def __init__(self, tmdb_id: int, requested_user: "User", requesting_user: "User"):
        self.tmdb_id = tmdb_id
        self.requested_user = requested_user
        self.requesting_user = requesting_user
        self.requested_date = date.today()


class SeriesRequest(Model):
    id = Column(Integer, primary_key=True)
    tvdb_id = Column(Integer)
    requested_user_id = Column(ForeignKey("user.id"))
    requested_user = relationship(
        "User",
        foreign_keys=[requested_user_id],
        backref=backref("received_series_requests", cascade="all,delete", lazy=True),
    )
    children = relationship(
        "SeriesChildRequest",
        cascade="all,delete,delete-orphan",
        back_populates="series",
    )
    UniqueConstraint(requested_user_id, tvdb_id)

    __repr_props__ = ("tvdb_id", "requested_user", "children")

    def __init__(self, tvdb_id: int, requested_user: "User"):
        self.tvdb_id = tvdb_id
        self.requested_user = requested_user


class SeriesChildRequest(Model):
    id = Column(Integer, primary_key=True)
    requested_date = Column(Date)
    response_date = Column(Date, nullable=True)
    approved = Column(Boolean, default=False)
    refused = Column(Boolean, default=False)
    series_id = Column(ForeignKey("seriesrequest.id"))
    selected_provider_id = Column(ForeignKey("providerconfig.id"), nullable=True)
    requesting_user_id = Column(ForeignKey("user.id"))
    requesting_user = relationship(
        "User",
        foreign_keys=[requesting_user_id],
        backref=backref("sent_series_requests", cascade="all,delete", lazy=True),
    )
    series = relationship("SeriesRequest", back_populates="children")
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

    def __init__(self, requesting_user: "User", seasons: List["SeasonRequest"]):
        self.requesting_user = requesting_user
        self.seasons = seasons
        self.requested_date = date.today()


class SeasonRequest(Model):
    id = Column(Integer, primary_key=True)
    season_number = Column(Integer)
    series_child_id = Column(ForeignKey("serieschildrequest.id"))
    episodes = relationship("EpisodeRequest", cascade="all,delete", backref="season")

    __repr_props__ = (
        "season_number",
        "episodes",
    )


class EpisodeRequest(Model):
    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer)
    available = Column(Boolean, default=False)
    season_id = Column(ForeignKey("seasonrequest.id"))

    __repr_props__ = ("episode_number", "available")
