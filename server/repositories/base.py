import math
from abc import ABC
from typing import Any, Dict, Generic, get_args, List, Optional, Union

from pydantic import BaseModel
from sqlalchemy.orm import Query, Session

from server.database import ModelType


class BaseRepository(ABC, Generic[ModelType]):
    def __init__(self, session: Session):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        :param session: A SQLAlchemy Session
        """
        self.session = session
        self.model = self.get_model()

    def get_model(self) -> ModelType:
        return get_args(self.__orig_bases__[-1])[0]

    def find_by(self, **filters) -> Optional[ModelType]:
        return self.session.query(self.model).filter_by(**filters).one_or_none()

    def find_all_by(
        self, page: int = None, per_page=None, **filters
    ) -> (List[ModelType], Optional[int], Optional[int]):
        query = self.session.query(self.model).filter_by(**filters)
        if page is not None:
            return paginate(query, per_page, page)
        return query.all()

    def search_by(self, field: str, value: str, limit: int = 3):
        return (
            self.session.query(self.model)
            .filter(getattr(self.model, field).contains(value))
            .limit(limit)
            .all()
        )

    def count(self):
        return self.session.query(self.model).count()

    def save(self, db_obj: ModelType) -> ModelType:
        """
        Persist an object to the database

        :param db_obj: Database object to be persisted
        """
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def update(
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
        obj_data = db_obj.as_dict()
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        db_obj = self.save(db_obj)
        return db_obj

    def remove(self, db_obj: ModelType):
        """
        Delete objects from the database

        :param db_obj: Database object to be deleted
        """
        self.session.delete(db_obj)
        self.session.commit()


def paginate(query: Query, per_page: int = None, page: int = None) -> (ModelType, int, int):
    if page is None:
        page = 1
    if per_page is None:
        per_page = 20

    results = query.limit(per_page).offset((page - 1) * per_page).all()
    if page == 1 and len(results) < per_page:
        total_results = len(results)
    else:
        total_results = query.count()
    total_pages = math.ceil(total_results / per_page)
    return results, total_results, total_pages
