from typing import Any, Dict, TypeVar, Union

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, func, inspect
from sqlalchemy.ext.declarative import (
    declarative_base,
    declared_attr,
)

Base = declarative_base()


class Model(Base):
    """Base Model class."""

    __abstract__ = True
    __repr_props__ = ()

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    def __repr__(self):
        properties = [
            f"{prop}={getattr(self, prop)!r}"
            for prop in self.__repr_props__
            if hasattr(self, prop)
        ]
        return f"<{self.__class__.__name__} {' '.join(properties)}>"

    def update(
        self,
        obj_in: Union[BaseModel, Dict[str, Any]],
    ):
        """
        Update an object's attributes

        :param obj_in: The schema or dict of attributes to update the object
        :return: The updated object
        """
        obj_data = self.as_dict()
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(self, field, update_data[field])

    def as_dict(self) -> dict:
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


ModelType = TypeVar("ModelType", bound=Model)


class Timestamp(object):
    """Mixin that define timestamp columns."""

    __datetime_func__ = func.now()

    created_at = Column(DateTime, default=__datetime_func__, nullable=False)

    updated_at = Column(
        DateTime,
        default=__datetime_func__,
        onupdate=__datetime_func__,
        nullable=False,
    )


def init_db():
    # Import all models so that they are registered befored the init
    from server import models  # noqa
    from server.database.session import engine

    Base.metadata.reflect(bind=engine)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
