from enum import Enum

from sqlalchemy import (
    Column,
    Date,
    Enum as DBEnum,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from server.database import Model


class MediaType(str, Enum):
    movies = "movies"
    series = "series"


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class Media(object):
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    poster_url = Column(String)
    art_url = Column(String)
    release_date = Column(Date)
    status = Column(String)


class Movie(Model, Media):
    __repr_props__ = ("title", "tmdb_id")

    tmdb_id = Column(Integer, unique=True, index=True)
    requests = relationship("MovieRequest")


class Series(Model, Media):
    __repr_props__ = ("title", "tvdb_id", "series_type")

    tvdb_id = Column(Integer, nullable=False)
    number_of_seasons = Column(Integer)
    series_type = Column(DBEnum(SeriesType), nullable=False)
    requests = relationship("SeriesRequest", back_populates="series")
