from __future__ import annotations

from typing import Any

from server.schemas.users import UserSchema

from .base import APIModel


class NotificationSchema(APIModel):
    message: str
    read: bool
    user: UserSchema


class NotificationAgentSchema(APIModel):
    enabled: bool
    settings: Any = None


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
