from typing import Any, Optional, Type

from pydantic import BaseModel

from server.models.base import ModelType


class APIModel(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

    def to_orm(self, orm_model: Type[ModelType], exclude=None) -> ModelType:
        return orm_model(**self.dict(include=vars(orm_model).keys(), exclude=exclude))


class ResponseMessage(BaseModel):
    detail: Any


class PaginatedResult(BaseModel):
    page: int = 1
    total_pages: Optional[int]
    total_results: Optional[int]
    results: list[Any]
