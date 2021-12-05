from enum import Enum

from sqlalchemy import (
    Column,
    Date,
    Enum as DBEnum,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import backref, declared_attr, Mapped, relationship

from server.models.base import Model


class MediaType(str, Enum):
    movie = "movies"
    series = "series"


class SeriesType(str, Enum):
    anime = "anime"
    standard = "standard"


class Media(Model):
    __repr_props__ = ("title", "media_type", "tmdb_id", "imdb_id", "tvdb_id")
    __table_args__ = (
        UniqueConstraint("tmdb_id", "media_type"),
        UniqueConstraint("imdb_id", "media_type"),
        UniqueConstraint("tvdb_id", "media_type"),
    )

    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    imdb_id = Column(String)
    tvdb_id = Column(Integer)
    title = Column(String, nullable=False)
    media_type = Column(DBEnum(MediaType), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class MediaServerContent(object):
    __table_args__ = (UniqueConstraint("external_id", "server_id"),)

    id = Column(Integer, primary_key=True)
    external_id = Column(String, nullable=False)
    added_at = Column(Date)

    @declared_attr
    def server_id(cls) -> Mapped[int]:
        return Column(ForeignKey("mediaserversetting.server_id"), nullable=False)


class MediaServerMedia(Model, MediaServerContent):
    __repr_props__ = ("media", "server")

    media_id: int = Column(ForeignKey("media.id"), nullable=False)
    server_library_id: int = Column(ForeignKey("mediaserverlibrary.id"))
    media: Media = relationship(
        "Media",
        lazy="joined",
        innerjoin=True,
        backref=backref("media_servers", lazy="selectin", cascade="all,delete,delete-orphan"),
    )
    server: "MediaServerSetting" = relationship(
        "MediaServerSetting",
        lazy="joined",
        innerjoin=True,
        backref=backref("server_media", cascade="all,delete,delete-orphan"),
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class MediaServerSeason(Model, MediaServerContent):
    __repr_props__ = ("season_number",)

    season_number = Column(Integer, nullable=False)
    server_media_id: int = Column(ForeignKey("mediaservermedia.id"), nullable=False)
    server_media: MediaServerMedia = relationship(
        "MediaServerMedia",
        lazy="joined",
        innerjoin=True,
        backref=backref("seasons", cascade="all,delete,delete-orphan"),
    )
    episodes: list["MediaServerEpisode"] = relationship(
        "MediaServerEpisode",
        lazy="selectin",
        back_populates="season",
        cascade="all,delete,delete-orphan",
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class MediaServerEpisode(Model, MediaServerContent):
    __repr_props__ = ("episode_number",)

    episode_number = Column(Integer, nullable=False)
    season_id: int = Column(ForeignKey("mediaserverseason.id"), nullable=False)
    season: MediaServerSeason = relationship(
        "MediaServerSeason", lazy="joined", innerjoin=True, back_populates="episodes"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
