from typing import List, Type

from server.models.media import Media
from server.models.requests import MediaRequest
from server.repositories.base import BaseRepository


class MediaRequestRepository(BaseRepository[MediaRequest]):
    def find_all_by_tmdb_id(self, tmdb_id: int) -> List[Type[MediaRequest]]:
        return self.session.query(MediaRequest).join(Media).filter(Media.tmdb_id == tmdb_id).all()

    def find_all_by_user_ids_and_tmdb_id(
        self, tmdb_id: int, requesting_user_id: int, requested_user_id: int
    ) -> List[Type[MediaRequest]]:
        return (
            self.session.query(MediaRequest)
            .join(Media)
            .filter(
                Media.tmdb_id == tmdb_id,
                MediaRequest.requesting_user_id == requesting_user_id,
                MediaRequest.requested_user_id == requested_user_id,
            )
            .all()
        )
