from enum import Enum

from sqlalchemy import (
    Column,
    Date,
    Enum as DBEnum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from server.database import Model


class MediaType(str, Enum):
    movies = "movies"
    series = "series"


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class Media(Model):
    __repr_props__ = ("title", "media_type")

    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer, unique=True, index=True)
    imdb_id = Column(String, unique=True, index=True)
    tvdb_id = Column(Integer, unique=True, index=True)
    media_type = Column(DBEnum(MediaType), nullable=False)
    title = Column(String, nullable=False)
    server_media: list = relationship("MediaServerMedia", back_populates="media")


class Season(Model):
    __repr_props__ = ("season_number", "episodes")

    id = Column(Integer, primary_key=True)
    season_number = Column(Integer, nullable=False)
    series_id = Column(ForeignKey("media.id"), nullable=False)
    media = relationship("Media")
    episodes: list = relationship("Episode", back_populates="season")
    server_seasons: list = relationship("MediaServerSeason", back_populates="season")


class Episode(Model):
    __repr_props__ = "episode_number"

    id = Column(Integer, primary_key=True)
    episode_number = Column(Integer, nullable=False)
    season_id = Column(ForeignKey("season.id"), nullable=False)
    season = relationship("Season", back_populates="episodes")
    server_episodes: list = relationship("MediaServerEpisode", back_populates="episode")


class MediaServerContent(object):
    id = Column(Integer, primary_key=True)
    server_media_id = Column(String)
    added_at = Column(Date)

    @declared_attr
    def server_id(cls):
        return Column(ForeignKey("mediaserversetting.server_id"))


class MediaServerMedia(Model, MediaServerContent):
    media_id = Column(ForeignKey("media.id"))
    media = relationship("Media", back_populates="server_media")


class MediaServerSeason(Model, MediaServerContent):
    season_id = Column(ForeignKey("season.id"))
    season = relationship("Season", back_populates="server_seasons")


class MediaServerEpisode(Model, MediaServerContent):
    episode_id = Column(ForeignKey("episode.id"))
    episode = relationship("Episode", back_populates="server_episodes")
