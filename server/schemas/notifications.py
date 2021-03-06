from typing import Any

from server.schemas.users import UserPublicSchema
from .base import APIModel


class NotificationSchema(APIModel):
    message: str
    read: bool
    user: UserPublicSchema


class NotificationAgentSchema(APIModel):
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


class EmailAgentSchema(NotificationAgentSchema):
    settings: EmailAgentSettings
