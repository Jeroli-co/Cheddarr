from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from server.schemas.core import PaginatedResult


class PublicConfig(BaseModel):
    log_level: str
    default_roles: int


class Log(BaseModel):
    time: str
    level: str
    process: str
    message: str


class LogResult(PaginatedResult):
    results: List[Log]


class Job(BaseModel):
    id: str
    name: str
    next_run_time: Optional[datetime]
