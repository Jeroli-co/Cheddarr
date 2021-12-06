from typing import Any, Optional, Type
from datetime import date
from typing import Type

from pydantic import BaseModel

from server.models.base import ModelType


class APIModel(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

    def to_orm(self, orm_model: Type[ModelType], exclude=None) -> ModelType:
        return orm_model(**self.dict(include=vars(orm_model).keys(), exclude=exclude))


class Date(date):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if v == "":
            return None
        return v


class ResponseMessage(BaseModel):
    detail: Any


class PaginatedResult(BaseModel):
    page: int = 1
    total_pages: Optional[int]
    total_results: Optional[int]
    results: list[Any]
