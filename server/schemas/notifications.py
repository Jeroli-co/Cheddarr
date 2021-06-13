from typing import Any

from server.schemas.users import UserSchema
from .core import APIModel


class NotificationSchema(APIModel):
    message: str
    read: bool
    user: UserSchema


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
