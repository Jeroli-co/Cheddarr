from typing import Any, Optional

from pydantic import Field

from server.schemas import APIModel, UserPublic


class Notification(APIModel):
    message: str
    read: bool
    user: UserPublic


class NotificationAgent(APIModel):
    enabled: bool
    settings: Any


class EmailAgentSettings(APIModel):
    smtp_port: int
    smtp_host: str
    smtp_user: str
    smtp_password: str
    sender_address: str
    sender_name: str
    ssl: bool


class EmailAgent(NotificationAgent):
    settings: EmailAgentSettings
