from collections.abc import Sequence
from typing import Any

from server.schemas.users import UserSchema

from .base import APIModel, PaginatedResponse


class NotificationSchema(APIModel):
    message: str
    read: bool
    user: UserSchema


class NotificationsResponse(PaginatedResponse):
    items: Sequence[NotificationSchema]


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
