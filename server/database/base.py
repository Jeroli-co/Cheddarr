from typing import TypeVar

import pytz
from sqlalchemy import Column, DateTime as DBDateTime, func, inspect, TypeDecorator
from sqlalchemy.orm import declarative_base, declared_attr

from server.core import config

Base = declarative_base()


class Model(Base):
    """Base Model class."""

    __mapper_args__ = {"eager_defaults": True, "always_refresh": True}
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

    def as_dict(self) -> dict:
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


class DateTime(TypeDecorator):
    impl = DBDateTime

    def process_bind_param(self, value, engine):
        return value

    def process_result_value(self, value, engine):
        return value.replace(tzinfo=pytz.timezone(config.TZ)).astimezone(pytz.timezone(config.TZ))


class Timestamp(object):
    """Mixin that define timestamp columns."""

    __datetime_func__ = func.now()

    created_at = Column(DateTime, server_default=__datetime_func__, nullable=False)

    updated_at = Column(
        DateTime,
        server_default=__datetime_func__,
        server_onupdate=__datetime_func__,
        nullable=False,
    )


def mapper_args(mapper_args_dict: dict) -> dict:
    return {**Model.__mapper_args__, **mapper_args_dict}


ModelType = TypeVar("ModelType", bound=Model)
