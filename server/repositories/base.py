from abc import ABC
from typing import Generic, get_args, Optional

from sqlalchemy.orm import Session

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

    def find_all_by(self, limit: int = 100, **filters) -> list[ModelType]:
        return self.session.query(self.model).filter_by(**filters).limit(limit).all()

    def search_by(self, field: str, value: str, limit: int = 3):
        return (
            self.session.query(self.model)
            .filter(getattr(self.model, field).contains(value))
            .limit(limit)
            .all()
        )

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
