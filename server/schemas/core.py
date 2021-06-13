from datetime import datetime
from typing import List, Optional, Type

from pydantic import BaseModel

from server.repositories.base import ModelType


class APIModel(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

    def to_orm(self, orm_model: Type[ModelType], exclude=None) -> ModelType:
        return orm_model(**self.dict(include=vars(orm_model).keys(), exclude=exclude))


class ResponseMessage(BaseModel):
    detail: str


class PaginatedResult(BaseModel):
    page: int = 1
    total_pages: int
    total_results: int
    results: List


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
