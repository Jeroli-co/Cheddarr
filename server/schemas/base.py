from typing import Type
from pydantic import BaseModel
from server.repositories.base import ModelType
from humps import camelize


class APIModel(BaseModel):
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        alias_generator = camelize

    def to_orm(self, orm_model: Type[ModelType]) -> ModelType:
        return orm_model(**self.dict(include=vars(orm_model).keys()))
