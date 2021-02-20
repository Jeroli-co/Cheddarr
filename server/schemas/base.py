from typing import Type

from pydantic import BaseModel

from server.repositories.base import ModelType


class APIModel(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True

    def to_orm(self, orm_model: Type[ModelType], exclude=None) -> ModelType:
        return orm_model(**self.dict(include=vars(orm_model).keys(), exclude=exclude))
