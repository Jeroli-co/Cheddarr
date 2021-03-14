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
from sqlalchemy.orm import backref, relationship

from server.database import Model


class MediaType(str, Enum):
    movies = "movies"
    series = "series"


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class Media(Model):
    __repr_props__ = ("title", "media_type", "tmdb_id")

    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer, unique=True, index=True)
    imdb_id = Column(String, unique=True, index=True)
    tvdb_id = Column(Integer, unique=True, index=True)
    title = Column(String, nullable=False)
    media_type = Column(DBEnum(MediaType), nullable=False)


class MediaServerContent(object):
    id = Column(Integer, primary_key=True)
    server_media_id = Column(String, nullable=False)
    added_at = Column(Date)

    @declared_attr
    def server_id(cls):
        return Column(ForeignKey("mediaserversetting.server_id"))


class MediaServerMedia(Model, MediaServerContent):
    __repr_props__ = ("media", "server")

    media_id = Column(ForeignKey("media.id"), nullable=False)
    server_library_id = Column(ForeignKey("mediaserverlibrary.id"))
    media = relationship("Media", backref=backref("media", cascade="all,delete,delete-orphan"))
    server = relationship(
        "MediaServerSetting", backref=backref("media", cascade="all,delete,delete-orphan")
    )
    library = relationship(
        "MediaServerLibrary", backref=backref("media", cascade="all,delete,delete-orphan")
    )


class MediaServerSeason(Model, MediaServerContent):
    __repr_props__ = ("season_number",)

    season_number = Column(Integer, nullable=False)
    media_id = Column(ForeignKey("mediaservermedia.id"), nullable=False)
    media = relationship(
        "MediaServerMedia", backref=backref("seasons", cascade="all,delete,delete-orphan")
    )
    episodes: list = relationship(
        "MediaServerEpisode", back_populates="season", cascade="all,delete,delete-orphan"
    )
    server = relationship(
        "MediaServerSetting", backref=backref("seasons", cascade="all,delete,delete-orphan")
    )


class MediaServerEpisode(Model, MediaServerContent):
    __repr_props__ = ("episode_number",)

    episode_number = Column(Integer, nullable=False)
    season_id = Column(ForeignKey("mediaserverseason.id"), nullable=False)
    season = relationship("MediaServerSeason", back_populates="episodes")
    server = relationship(
        "MediaServerSetting", backref=backref("episodes", cascade="all,delete,delete-orphan")
    )
