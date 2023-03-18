from datetime import datetime

from pydantic import BaseModel

from server.schemas.base import PaginatedResponse


class PublicConfig(BaseModel):
    log_level: str | None
    default_roles: int | None


class Log(BaseModel):
    time: str
    level: str
    process: str
    message: str


class LogResponse(PaginatedResponse):
    items: list[Log]


class Job(BaseModel):
    id: str
    name: str
    next_run_time: datetime | None
