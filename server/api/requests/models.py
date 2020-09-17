from enum import Enum, auto
from server.database import (
    Model,
    Column,
    Integer,
    ForeignKey,
    relationship,
    backref,
)
from server.database import Enum as DBEnum


class RequestType(str, Enum):
    MOVIE_REQUEST = auto()
    SERIES_REQUEST = auto()


class Request(Model):
    requesting_user_id = Column(Integer, ForeignKey("User.id"), primary_key=True)
    receiving_user_id = Column(Integer, ForeignKey("User.id"), primary_key=True)
    tmdb_id = Column(Integer, primary_key=True)
    request_type = Column(DBEnum(RequestType))
    requesting_user = relationship(
        "User",
        primaryjoin=("User.id" == requesting_user_id),
        backref=backref("requested_requests", cascade="all,delete", lazy="dynamic"),
    )
    receiving_user = relationship(
        "User",
        primaryjoin=("User.id" == receiving_user_id),
        backref=backref("received_requests", cascade="all,delete", lazy="dynamic"),
    )

    __repr_props__ = ("requesting_user", "receiving_user", "tmdb_id")

    def __init__(self, requesting_user, receiving_user):
        self.requesting_user = requesting_user
        self.receiving_user = receiving_user
