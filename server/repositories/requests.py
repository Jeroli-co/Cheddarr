from __future__ import annotations

from typing import Any

import sqlalchemy as sa

from server.models.media import Media
from server.models.requests import MediaRequest
from server.repositories.base import BaseRepository, Select
from server.repositories.media import external_ids_filter


class MediaRequestRepository(BaseRepository[MediaRequest]):
    """Repository for MediaRequest model."""

    def find_by_tmdb_id(
        self,
        tmdb_id: int | None = None,
        tvdb_id: int | None = None,
        imdb_id: str | None = None,
        **filters: Any,
    ) -> Select[MediaRequest]:
        statement = (
            sa.select(self.model).filter_by(**filters).join(Media).where(external_ids_filter(imdb_id, tmdb_id, tvdb_id))
        )
        return self.select(statement)
