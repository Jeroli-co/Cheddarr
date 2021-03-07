import math
from abc import ABC
from typing import Generic, get_args, List, Optional

from sqlalchemy.orm import Query, Session

from server.database import ModelType


class BaseRepository(Generic[ModelType], ABC):
    def __init__(self, session: Session):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        :param session: A SQLAlchemy Session
        """
        self.session = session
        self.model = get_args(self.__orig_bases__[0])[0]

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
