from sqlalchemy import select

from server.models.media import Media
from server.models.requests import MediaRequest
from server.repositories.base import BaseRepository


class MediaRequestRepository(BaseRepository[MediaRequest]):
    async def find_all_by_tmdb_id(self, tmdb_id: int, **filters) -> list[MediaRequest]:
        query = select(self.model).filter_by(**filters).join(Media).where(Media.tmdb_id == tmdb_id)
        result = await self.execute(query)
        return result.all()
