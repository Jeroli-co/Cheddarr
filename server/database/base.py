from datetime import datetime
from typing import Any, Dict, TypeVar, Union

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import (
    declarative_base,
    declared_attr,
)
from sqlalchemy.orm import class_mapper


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

    def as_dict(self, found=None):
        if found is None:
            found = set()
        mapper = class_mapper(self.__class__)
        columns = [column.key for column in mapper.columns]
        get_key_value = (
            lambda c: (c, getattr(self, c).isoformat())
            if isinstance(getattr(self, c), datetime)
            else (c, getattr(self, c))
        )
        out = dict(map(get_key_value, columns))
        for name, relation in mapper.relationships.items():
            if relation not in found:
                found.add(relation)
                related_obj = getattr(self, name)
                if related_obj is not None:
                    if not relation.uselist:
                        out[name] = related_obj.as_dict(found)
        return out


class Timestamp(object):
    """Mixin that define timestamp columns."""

    __datetime_func__ = datetime.utcnow

    created_at = Column(DateTime(timezone=True), default=__datetime_func__, nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        default=__datetime_func__,
        onupdate=__datetime_func__,
        nullable=False,
    )


ModelType = TypeVar("ModelType", bound=Model)
