from server.models.notifications import Notification, NotificationAgent
from server.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    ...


class NotificationAgentRepository(BaseRepository[NotificationAgent]):
    ...
