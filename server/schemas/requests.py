from __future__ import annotations

from typing import List
from uuid import UUID

from server.models.requests import SeriesType
from server.schemas import APIModel, UserPublic


class MovieRequest(APIModel):
    id: int
    tmdb_id: int
    approved: bool
    refused: bool
    available: bool

    requested_user: UserPublic


class MovieRequestCreate(APIModel):
    tmdb_id: int
    requested_username: str


class SeriesRequest(APIModel):
    id: int
    tvdb_id: int
    series_type: SeriesType
    children: List[SeriesChildRequest]
    requested_user: UserPublic


class SeriesChildRequest(APIModel):
    id: int
    approved: bool
    refused: bool
    series_id: int
    selected_provider_id: UUID
    requesting_user: UserPublic
    parent: SeriesRequest
    seasons: List[SeasonRequest]


class SeriesChildRequestCreate(APIModel):
    requested_username: str
    tvdb_id: int
    series_type: SeriesType
    seasons: List[SeasonRequest]


class SeasonRequest(APIModel):
    season_number: int
    episodes: List[EpisodeRequest]


class EpisodeRequest(APIModel):
    episode_number: int
    available: bool
