from __future__ import annotations
from datetime import date
from typing import List

from pydantic import AnyHttpUrl, Field

from .base import ProviderConfig
from .. import APIModel


class PlexServer(APIModel):
    name: str
    machine_id: str


class PlexConfig(ProviderConfig):
    servers: List[PlexServer]


class PlexConfigCreate(APIModel):
    api_key: str
    user_id: int
    plex_user_id: int


class PlexConfigUpdate(APIModel):
    servers: List[PlexServer]
    enabled: bool


###################
# PlexAPI schemas #
###################


class PlexMediaTag(APIModel):
    name: str = Field(alias="tag")
    role: str
    thumbUrl: AnyHttpUrl = Field(alias="thumb")


class PlexVideo(APIModel):
    id: int = Field(alias="ratingKey")
    type: str
    title: str
    thumbUrl: AnyHttpUrl
    artUrl: AnyHttpUrl
    summary: str
    releaseDate: date
    rating: float
    contentRating: str
    isWatched: bool
    webUrl: AnyHttpUrl = Field(
        default_factory=lambda media: "%s/web/index.html#!/server/%s/details?key=%s"
        % (
            media._server._baseurl,
            media._server.machineIdentifier,
            media.key,
        ),
        const=True,
    )


class PlexMovie(PlexVideo):
    duration: int
    actors: List[PlexMediaTag]
    directors: List[PlexMediaTag]
    studio: str
    genres: List[PlexMediaTag]


class PlexSeries(PlexVideo):
    seasons: List[PlexSeason]
    actors: List[PlexMediaTag]
    studio: str
    genres: List[PlexMediaTag]


class PlexSeason(PlexVideo):
    seriesId: int = Field(alias="parentRatingKey")
    seriesTitle: str = Field(alias="parentTitle")
    seasonNumber: int
    episodes: List[PlexEpisode]


class PlexEpisode(PlexVideo):
    seriesId: int = Field(alias="grandparentRatingKey")
    seriesTitle: str = Field(alias="grandparentTitle")
    seasonNumber: int
    episodeNumber: int = Field(alias="index")
    seasonThumbUrl: AnyHttpUrl = Field(
        default_factory=lambda ep: ep.url(ep.parentThumb), const=True
    )
    duration: int
