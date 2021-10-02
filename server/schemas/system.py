from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from server.schemas.core import PaginatedResult


class PublicConfig(BaseModel):
    log_level: Optional[str]
    default_roles: Optional[int]


class Log(BaseModel):
    time: str
    level: str
    process: str
    message: str


class LogResult(PaginatedResult):
    results: list[Log]


class Job(BaseModel):
    id: str
    name: str
    next_run_time: Optional[datetime]
