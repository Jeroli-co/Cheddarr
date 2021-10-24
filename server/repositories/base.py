import math
from abc import ABC
from typing import Any, Dict, Generic, get_args, Optional, Tuple, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import Executable, Select
from sqlalchemy.sql.functions import count

from server.models.base import ModelType


class BaseRepository(ABC, Generic[ModelType]):
    def __init__(self, session: AsyncSession):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        :param session: A SQLAlchemy AsyncSession
        """
        self.session = session
        self.model = self.get_model()

    def get_model(self) -> ModelType:
        return get_args(self.__orig_bases__[-1])[0]

    async def execute(self, statement: Executable):
        db_execute = await self.session.execute(statement)
        return db_execute

    async def save(self, db_obj: ModelType) -> ModelType:
        """
        Persist an object to the database

        :param db_obj: Database object to be persisted
        """
        self.session.add(db_obj)
        await self.session.commit()
        return db_obj

    async def update(
        self,
        db_obj: ModelType,
        obj_in: Union[BaseModel, Dict[str, Any]],
    ) -> ModelType:
        """
        Update an object's in the database

        :param db_obj: Database object to be updated
        :param obj_in: The schema or dict of attributes to update the object
        :return: The updated object
        """
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        await self.save(db_obj)
        return db_obj

    async def remove(self, db_obj: ModelType):
        """
        Delete objects from the database

        :param db_obj: Database object to be deleted
        """
        await self.session.delete(db_obj)
        await self.session.commit()

    async def remove_by(self, **filters):
        result = await self.execute(
            delete(self.model).filter_by(**filters).execution_options(synchronize_session="fetch")
        )
        await self.session.commit()
        return result.rowcount

    async def find_by(self, **filters) -> Optional[ModelType]:
        result = await self.execute(select(self.model).filter_by(**filters))
        return result.scalar_one_or_none()

    async def find_all_by(
        self, page: int = None, per_page=None, **filters
    ) -> list[ModelType] | Tuple[list[ModelType], Optional[int], Optional[int]]:
        query = select(self.model).filter_by(**filters)
        if page is not None:
            return await self.paginate(query, per_page, page)
        result = await self.execute(query)
        return result.scalars().all()

    async def search_by(self, field: str, value: str, limit: int = 3) -> list[ModelType]:
        results = await self.execute(
            select(self.model).where(getattr(self.model, field).contains(value)).limit(limit)
        )
        return results.scalars().all()

    async def count(self) -> int:
        result = await self.execute(select(count()).select_from(self.model))
        return result.scalar_one()

    async def paginate(
        self, query: Select, per_page: int = None, page: int = None
    ) -> Tuple[list[ModelType], int, int]:
        if page is None:
            page = 1
        if per_page is None:
            per_page = 20

        results = await self.execute(query.limit(per_page).offset((page - 1) * per_page))
        results = results.scalars().all()
        if page == 1 and len(results) < per_page:
            total_results = len(results)
        else:
            total_results = await self.count()
        total_pages = math.ceil(total_results / per_page)
        return results, total_results, total_pages
