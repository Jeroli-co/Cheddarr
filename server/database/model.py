from typing import Any, Dict, Generic, List, Optional, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import Session

from server.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class Model(Base, Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base Model class with CRUD operations."""

    __abstract__ = True

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    @classmethod
    def create(
        cls, db: Session, obj_in: CreateSchemaType, commit: bool = True
    ) -> ModelType:
        obj_in_data = jsonable_encoder(obj_in, by_alias=False)
        db_obj = cls().fill(obj_in_data)
        db_obj.save(db, commit=commit)
        return db_obj

    @classmethod
    def get(cls, db: Session, id: Any) -> Optional[ModelType]:
        return db.query(cls).filter(cls.id == id).first()

    @classmethod
    def find_by(cls, db: Session, **filters) -> Optional[ModelType]:
        return db.query(cls).filter_by(**filters).one_or_none()

    @classmethod
    def find_all_by(cls, db: Session, limit: int = 100, **filters) -> List[ModelType]:
        return db.query(cls).filter_by(**filters).limit(limit).all()

    def save(self, db: Session, commit: bool = True) -> ModelType:
        db.add(self)
        if commit:
            db.commit()
            db.refresh(self)
        return self

    def update(
        self,
        db: Session,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
        commit: bool = True,
    ) -> ModelType:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        self.fill(update_data)
        print(self)
        self.save(db, commit=commit)
        return self

    def delete(self, db: Session) -> ModelType:
        db.delete(self)
        db.commit()
        return self

    def fill(self, data: Dict[str, Any]) -> ModelType:
        for name in data.keys():
            if hasattr(self, name) and not name.startswith("_"):
                setattr(self, name, data[name])
            else:
                raise KeyError("Attribute '{}' doesn't exist".format(name))

        return self
