from typing import List, Optional

from sqlalchemy import desc, or_, select

from server.models.media import (
    Media,
    MediaServerEpisode,
    MediaServerMedia,
    MediaServerSeason,
    MediaType,
)
from server.repositories.base import BaseRepository


class MediaRepository(BaseRepository[Media]):
    async def find_by_external_id(
        self, tmdb_id: int = None, tvdb_id: int = None, imdb_id=None
    ) -> Optional[Media]:
        filters = []
        if tmdb_id is not None:
            filters.append(self.model.tmdb_id == tmdb_id)
        elif imdb_id is not None:
            filters.append(self.model.imdb_id == imdb_id)
        elif tvdb_id is not None:
            filters.append(self.model.tvdb_id == tvdb_id)

        result = await self.execute(select(self.model).where(or_(*filters)))
        return result.one_or_none()


class MediaServerMediaRepository(BaseRepository[MediaServerMedia]):
    async def find_by_media_external_id(
        self,
        tmdb_id: int = None,
        tvdb_id: int = None,
        imdb_id=None,
    ) -> List[MediaServerMedia]:
        query = select(self.model).join(Media)
        if tmdb_id is not None:
            query = query.where(Media.tmdb_id == tmdb_id)
        elif imdb_id is not None:
            query = query.where(Media.imdb_id == imdb_id)
        elif tvdb_id is not None:
            query = query.where(Media.tvdb_id == tvdb_id)

        result = await self.execute(query)
        return result.all()

    async def find_all_recently_added(
        self, media_type: MediaType, page: int = None, per_page: int = None
    ) -> (List[Media], Optional[int], Optional[int]):
        query = (
            select(self.model)
            .join(Media)
            .where(Media.media_type == media_type)
            .order_by(desc(self.model.added_at))
        )
        if page is not None:
            return await self.paginate(query, per_page, page)
        return query.all()


class MediaServerSeasonRepository(BaseRepository[MediaServerSeason]):
    async def find_by_external_id_and_season_number(
        self,
        season_number: int,
        tmdb_id: int = None,
        tvdb_id: int = None,
        imdb_id=None,
    ) -> List[MediaServerSeason]:
        query = (
            select(self.model)
            .join(MediaServerMedia)
            .join(Media)
            .where(self.model.season_number == season_number)
        )
        if tmdb_id is not None:
            query = query.where(Media.tmdb_id == tmdb_id)
        if imdb_id is not None:
            query = query.where(Media.imdb_id == imdb_id)
        if tvdb_id is not None:
            query = query.where(Media.tvdb_id == tvdb_id)

        result = await self.execute(query)
        return result.all()


class MediaServerEpisodeRepository(BaseRepository[MediaServerEpisode]):
    async def find_by_external_id_and_season_number_and_episode_number(
        self,
        season_number: int,
        episode_number: int,
        tmdb_id: int = None,
        tvdb_id: int = None,
        imdb_id=None,
    ) -> List[MediaServerEpisode]:
        query = (
            select(self.model)
            .join(MediaServerSeason)
            .join(MediaServerMedia)
            .join(Media)
            .where(MediaServerSeason.season_number == season_number)
            .where(self.model.episode_number == episode_number)
        )
        if tmdb_id is not None:
            query = query.where(Media.tmdb_id == tmdb_id)
        if imdb_id is not None:
            query = query.where(Media.imdb_id == imdb_id)
        if tvdb_id is not None:
            query = query.where(Media.tvdb_id == tvdb_id)

        result = await self.execute(query)
        return result.all()
