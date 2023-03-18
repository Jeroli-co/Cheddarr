from datetime import date
from typing import Any

from pydantic import BaseModel

from server.repositories.base import ModelType


class APIModel(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        smart_union = True

    def to_orm(self, orm_model: type[ModelType]) -> ModelType:
        return orm_model(**self.dict(include=vars(orm_model).keys()))


class Date(date):
    @classmethod
    def __get_validators__(cls) -> Any:
        yield cls.validate

    @classmethod
    def validate(cls, v: Any) -> Any:
        if v == "":
            return None
        return v


class ResponseMessage(BaseModel):
    detail: str


class PaginatedResponse(BaseModel):
    class Config:
        smart_union = True

    page: int = 1
    pages: int | None
    total: int | None
    items: Any
