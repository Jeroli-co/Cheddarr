from typing import List, Optional

from sqlalchemy import desc

from server.models.media import (
    Media,
    MediaServerEpisode,
    MediaServerMedia,
    MediaServerSeason,
    MediaType,
)
from server.repositories.base import BaseRepository, paginate


class MediaRepository(BaseRepository[Media]):
    def find_by_external_id(
        self, tmdb_id: int = None, tvdb_id: int = None, imdb_id=None
    ) -> Optional[Media]:
        query = self.session.query(self.model)
        if tmdb_id is not None:
            query = query.filter(self.model.tmdb_id == tmdb_id)
        if imdb_id is not None:
            query = query.filter(self.model.imdb_id == imdb_id)
        if tvdb_id is not None:
            query = query.filter(self.model.tvdb_id == tvdb_id)

        return query.one_or_none()

    def find_all_recently_added(
        self, media_type: MediaType, server_ids: List[str], page: int = None, per_page: int = None
    ):
        query = (
            self.session.query(self.model)
            .join(MediaServerMedia)
            .filter(
                self.model.media_type == media_type, MediaServerMedia.server_id.in_(server_ids)
            )
            .distinct()
            .order_by(desc(MediaServerMedia.added_at))
        )
        if page is not None:
            return paginate(query, per_page, page)
        return query.all()


class MediaServerMediaRepository(BaseRepository[MediaServerMedia]):
    def find_by_external_id_and_server_ids(
        self,
        server_ids: List[str],
        tmdb_id: int = None,
        tvdb_id: int = None,
        imdb_id=None,
    ) -> List[MediaServerMedia]:
        query = (
            self.session.query(self.model).join(Media).filter(self.model.server_id.in_(server_ids))
        )
        if tmdb_id is not None:
            query = query.filter(Media.tmdb_id == tmdb_id)
        if imdb_id is not None:
            query = query.filter(Media.imdb_id == imdb_id)
        if tvdb_id is not None:
            query = query.filter(Media.tvdb_id == tvdb_id)

        return query.all()


class MediaServerSeasonRepository(BaseRepository[MediaServerSeason]):
    def find_by_external_id_and_season_number_and_server_ids(
        self,
        season_number: int,
        server_ids: List[str],
        tmdb_id: int = None,
        tvdb_id: int = None,
        imdb_id=None,
    ) -> List[MediaServerSeason]:
        query = (
            self.session.query(self.model)
            .join(MediaServerMedia)
            .join(Media)
            .filter(self.model.season_number == season_number)
            .filter(self.model.server_id.in_(server_ids))
        )
        if tmdb_id is not None:
            query = query.filter(Media.tmdb_id == tmdb_id)
        if imdb_id is not None:
            query = query.filter(Media.imdb_id == imdb_id)
        if tvdb_id is not None:
            query = query.filter(Media.tvdb_id == tvdb_id)

        return query.all()


class MediaServerEpisodeRepository(BaseRepository[MediaServerEpisode]):
    def find_by_external_id_and_season_number_and_episode_number_and_server_ids(
        self,
        season_number: int,
        episode_number: int,
        server_ids: List[str],
        tmdb_id: int = None,
        tvdb_id: int = None,
        imdb_id=None,
    ) -> List[MediaServerEpisode]:
        query = (
            self.session.query(self.model)
            .join(MediaServerSeason)
            .join(MediaServerMedia)
            .join(Media)
            .filter(MediaServerSeason.season_number == season_number)
            .filter(self.model.episode_number == episode_number)
            .filter(self.model.server_id.in_(server_ids))
        )
        if tmdb_id is not None:
            query = query.filter(Media.tmdb_id == tmdb_id)
        if imdb_id is not None:
            query = query.filter(Media.imdb_id == imdb_id)
        if tvdb_id is not None:
            query = query.filter(Media.tvdb_id == tvdb_id)

        return query.all()
