from dataclasses import dataclass, field
from typing import List, Optional


from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from .base import ProviderConfig


class SonarrConfig(ProviderConfig):

    host = Column(String(128))
    port = Column(String(5), nullable=True)
    ssl = Column(Boolean, default=False)
    root_folder = Column(String(128))
    anime_root_folder = Column(String(128), nullable=True)
    quality_profile_id = Column(Integer)
    anime_quality_profile_id = Column(Integer, nullable=True)
    language_profile_id = Column(Integer, nullable=True)
    anime_language_profile_id = Column(Integer, nullable=True)
    version = Column(Integer)
    series_requests = relationship(
        "SeriesChildRequest",
        primaryjoin="SeriesChildRequest.selected_provider_id==SonarrConfig.id",
        foreign_keys="SeriesChildRequest.selected_provider_id",
        backref="selected_provider",
    )
    __repr_props__ = (
        *ProviderConfig.__repr_props__,
        "host",
        "port",
        "ssl",
        "version",
    )


@dataclass
class SonarrAddOptions:
    ignore_episodes_with_files: bool = field(
        metadata={"data_key": "ignoreEpisodesWithFiles"}
    )
    ignore_episodes_without_files: bool = field(
        metadata={"data_key": "ignoreEpisodesWithoutFiles"}
    )
    search_for_missing_episodes: bool = field(
        metadata={"data_key": "searchForMissingEpisodes"}
    )


@dataclass
class SonarrSeason:
    season_number: int = field(metadata={"data_key": "seasonNumber"})
    monitored: bool


@dataclass
class SonarrSeries:

    id: Optional[int]
    title: str
    tvdb_id: int = field(metadata={"data_key": "tvdbId"})
    title_slug: str = field(metadata={"data_key": "titleSlug"})
    quality_profile_id: int = field(metadata={"data_key": "qualityProfileId"})
    language_profile_id: int = field(metadata={"data_key": "languageProfileId"})
    root_folder_path: Optional[str] = field(metadata={"data_key": "rootFolderPath"})
    series_type: str
    add_options: Optional[SonarrAddOptions] = field(metadata={"data_key": "addOptions"})
    seasons: List[SonarrSeason]


@dataclass
class SonarrEpisode:

    id: int
    episode_number: int = field(metadata={"data_key": "episodeNumber"})
    season_number: int = field(metadata={"data_key": "seasonNumber"})
    monitored: bool
    has_file: bool = field(metadata={"data_key": "hasFile"})
