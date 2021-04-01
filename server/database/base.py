from datetime import datetime
from typing import TypeVar

import pytz
from sqlalchemy import Column, DateTime as DBDateTime, TypeDecorator
from sqlalchemy.ext.declarative import (
    declarative_base,
    declared_attr,
)
from sqlalchemy.orm import class_mapper

from server.core import config

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


class DateTime(TypeDecorator):
    impl = DBDateTime

    def process_bind_param(self, value, engine):
        return value

    def process_result_value(self, value, engine):
        return value.replace(tzinfo=pytz.timezone(config.TZ)).astimezone(pytz.timezone(config.TZ))


class Timestamp(object):
    """Mixin that define timestamp columns."""

    __datetime_func__ = datetime.now()

    created_at = Column(DateTime, default=__datetime_func__, nullable=False)

    updated_at = Column(
        DateTime,
        default=__datetime_func__,
        onupdate=__datetime_func__,
        nullable=False,
    )


ModelType = TypeVar("ModelType", bound=Model)
