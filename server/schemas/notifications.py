from __future__ import annotations

from typing import Any

from pydantic import SecretStr, field_serializer

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
    smtp_password: SecretStr
    sender_address: str
    sender_name: str
    ssl: bool

    @field_serializer("smtp_password")
    def dump_secret(self, v: SecretStr) -> str:
        return v.get_secret_value()


class EmailAgentSchema(NotificationAgentSchema):
    settings: EmailAgentSettings
