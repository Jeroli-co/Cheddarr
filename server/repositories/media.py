from __future__ import annotations

import sqlalchemy as sa
from sqlalchemy.sql.elements import ColumnElement

from server.models.media import (
    Media,
    MediaServerEpisode,
    MediaServerMedia,
    MediaServerSeason,
    MediaType,
)
from server.repositories.base import BaseRepository, Select


class MediaRepository(BaseRepository[Media]):
    """Repository for Media model."""

    def find_by_external_id(
        self,
        tmdb_id: int | None = None,
        tvdb_id: int | None = None,
        imdb_id: str | None = None,
    ) -> Select[Media]:
        filters = external_ids_filter(imdb_id, tmdb_id, tvdb_id)
        statement = sa.select(self.model).where(filters)
        return self.select(statement)


class MediaServerMediaRepository(BaseRepository[MediaServerMedia]):
    """Repository for MediaServerMedia model."""

    def find_by_media_external_id(
        self,
        tmdb_id: int | None = None,
        tvdb_id: int | None = None,
        imdb_id: str | None = None,
    ) -> Select[MediaServerMedia]:
        statement = sa.select(self.model).join(Media).where(external_ids_filter(imdb_id, tmdb_id, tvdb_id))
        return self.select(statement)

    def find_recently_added(self, media_type: MediaType) -> Select[MediaServerMedia]:
        statement = (
            sa.select(self.model)
            .join(Media)
            .where(Media.media_type == media_type)
            .order_by(sa.desc(self.model.added_at))
        )
        return self.select(statement)


class MediaServerSeasonRepository(BaseRepository[MediaServerSeason]):
    """Repository for MediaServerSeason model."""

    def find_by_external_id_and_season_number(
        self,
        season_number: int,
        tmdb_id: int | None = None,
        tvdb_id: int | None = None,
        imdb_id: str | None = None,
    ) -> Select[MediaServerSeason]:
        statement = (
            sa.select(self.model)
            .join(MediaServerMedia)
            .join(Media)
            .where(self.model.season_number == season_number)
            .where(external_ids_filter(imdb_id, tmdb_id, tvdb_id))
        )
        return self.select(statement)


class MediaServerEpisodeRepository(BaseRepository[MediaServerEpisode]):
    """Repository for MediaServerEpisode model."""

    def find_by_external_id_and_season_number_and_episode_number(
        self,
        season_number: int,
        episode_number: int,
        tmdb_id: int | None = None,
        tvdb_id: int | None = None,
        imdb_id: str | None = None,
    ) -> Select[MediaServerEpisode]:
        statement = (
            sa.select(self.model)
            .join(MediaServerSeason)
            .join(MediaServerMedia)
            .join(Media)
            .where(MediaServerSeason.season_number == season_number)
            .where(self.model.episode_number == episode_number)
            .where(sa.or_(external_ids_filter(imdb_id, tmdb_id, tvdb_id)))
        )
        return self.select(statement)


def external_ids_filter(
    imdb_id: str | None = None,
    tmdb_id: int | None = None,
    tvdb_id: int | None = None,
) -> ColumnElement[bool]:
    filter = []
    if tmdb_id is not None:
        filter.append(Media.tmdb_id == tmdb_id)
    elif imdb_id is not None:
        filter.append(Media.imdb_id == imdb_id)
    elif tvdb_id is not None:
        filter.append(Media.tvdb_id == tvdb_id)
    return sa.or_(*filter)
