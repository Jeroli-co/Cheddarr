from server.models.notifications import Notification, NotificationAgent
from server.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    pass


class NotificationAgentRepository(BaseRepository[NotificationAgent]):
    pass
