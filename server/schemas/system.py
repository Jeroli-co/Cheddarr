from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class PublicConfig(BaseModel):
    log_level: str | None = None
    default_roles: int | None = None


class Log(BaseModel):
    time: str
    level: str
    process: str
    message: str


class Job(BaseModel):
    id: str
    name: str
    next_run_time: datetime | None = None
