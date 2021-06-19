from typing import List, Type

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

