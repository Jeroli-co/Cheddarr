from enum import Enum

from sqlalchemy import (
    Column,
    Date,
    Enum as DBEnum,
    ForeignKey,
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


class MediaBase(object):
    id = Column(Integer, primary_key=True)
    provider_media_id = Column(String, nullable=False)
    added_at = Column(Date)


class Media(MediaBase, Model):
    __repr_props__ = ("tmdb_id", "imdb_id", "tvdb_id", "title")

    provider_setting_id = Column(ForeignKey("providersetting.id"), nullable=False)
    tmdb_id = Column(Integer, unique=True, index=True)
    imdb_id = Column(String, unique=True, index=True)
    tvdb_id = Column(Integer, unique=True, index=True)
    media_type = Column(DBEnum(MediaType), nullable=False)
    title = Column(String, nullable=False)


class Season(MediaBase, Model):
    __repr_props__ = ("season_number", "episodes")

    season_number = Column(Integer, nullable=False)
    provider_series_id = Column(String, nullable=False)
    series_id = Column(ForeignKey("media.id"), nullable=False)
    media = relationship("Media")
    episodes = relationship("Episode", back_populates="season")


class Episode(MediaBase, Model):
    __repr_props__ = "episode_number"

    episode_number = Column(Integer, nullable=False)
    provider_series_id = Column(String, nullable=False)
    provider_season_id = Column(String, nullable=False)
    season_id = Column(ForeignKey("season.id"), nullable=False)
    season = relationship("Season", back_populates="episodes")
