from __future__ import annotations

import sqlalchemy as sa

from server.models.notifications import Notification, NotificationAgent
from server.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    """Repository for Notification model."""

    async def remove_all_by_user_id(self, user_id: int) -> None:
        """Remove all notifications for a user."""
        statement = sa.delete(self.model).where(self.model.user_id == user_id)
        await self.session.execute(statement)


class NotificationAgentRepository(BaseRepository[NotificationAgent]):
    """Repository for NotificationAgent model."""

    ...
