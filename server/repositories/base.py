from abc import ABC
from typing import Generic, TypeVar

from sqlalchemy.orm import Session

from server.database import ModelType


class BaseRepository(Generic[ModelType], ABC):
    def __init__(self, session: Session):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        :param session: A SQLAlchemy Session
        """
        self.session = session

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
