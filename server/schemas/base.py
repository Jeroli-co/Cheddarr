from __future__ import annotations

import dataclasses
from collections.abc import Sequence
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict

from server.repositories.base import ModelType


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    def to_orm(self, orm_model: type[ModelType]) -> ModelType:
        return orm_model(**self.model_dump(include={f.name for f in dataclasses.fields(orm_model) if f.init}))


SchemaType = TypeVar("SchemaType", bound=BaseModel)


class PaginatedResponse(BaseModel, Generic[SchemaType]):
    page: int | None
    pages: int | None
    total: int | None
    results: Sequence[SchemaType]


class ResponseMessage(BaseModel):
    detail: Any = None
