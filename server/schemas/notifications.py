from typing import Any

from server.schemas import APIModel, UserPublic


class Notification(APIModel):
    message: str
    read: bool
    user: UserPublic


class EmailAgentSettings(APIModel):
    smtp_port: int
    smtp_host: str
    smtp_user: str
    smtp_password: str
    sender_address: str
    sender_name: str
    ssl: bool


class EmailAgent(APIModel):
    id: int
    enabled: bool
    settings: EmailAgentSettings


class EmailAgentCreateUpdate(APIModel):
    enabled: bool
    settings: EmailAgentSettings
