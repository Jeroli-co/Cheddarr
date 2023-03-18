from abc import ABC
from datetime import datetime, timezone
from functools import partial
from typing import TYPE_CHECKING, Annotated, Any, TypeVar

import pydantic
from sqlalchemy import DateTime, FunctionElement, TypeDecorator, inspect
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import Mapped, declarative_mixin, declared_attr, mapped_column
from sqlalchemy.orm import relationship as db_relationship

from server.core.utils import camel_to_snake_case
from server.database.base import Base

if TYPE_CHECKING:  # TODO: remove this when mypy fully supports PEP 681

    class MappedAsDataclass:
        ...

else:
    from sqlalchemy.orm import MappedAsDataclass


class Model(MappedAsDataclass, Base, dataclass_callable=pydantic.dataclasses.dataclass):
    """Base Model class."""

    __mapper_args__ = {"eager_defaults": True, "always_refresh": True}
    __abstract__ = True

    @classmethod
    @declared_attr.directive
    def __tablename__(cls):  # noqa: ANN206
        return camel_to_snake_case(cls.__name__).lower()

    def dict(self) -> dict[Any, Any]:
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}  # type: ignore


class UtcDateTime(TypeDecorator[Any], ABC):
    """Column type for storing UTC datetime."""

    impl = DateTime(timezone=True)
    cache_ok = True

    def process_bind_param(self, value, dialect) -> datetime | None:  # noqa
        if value is not None:
            if not isinstance(value, datetime):
                raise TypeError("expected datetime.datetime, not " + repr(value))
            if value.tzinfo is None:
                raise ValueError("naive datetime is disallowed")
            return value.astimezone(timezone.utc)
        return value

    def process_result_value(self, value, dialect):  # noqa
        if value is not None:
            value = value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)
        return value


class Utcnow(FunctionElement[Any]):
    """UTCNOW() expression for multiple dialects."""

    inherit_cache = True
    type = UtcDateTime()


@compiles(Utcnow, "sqlite")
def sqlite_sql_utcnow(element, compiler, **kw) -> str:  # noqa
    """SQLite DATETIME('NOW') returns a correct `datetime.datetime` but does not add milliseconds to it."""
    return r"(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))"


@declarative_mixin
class Timestamp:
    """Mixin that define timestamp columns."""

    __datetime_func__ = Utcnow()

    created_at: Mapped[datetime] = mapped_column(
        UtcDateTime,
        init=False,
        repr=True,
        server_default=__datetime_func__,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        UtcDateTime,
        init=False,
        repr=True,
        server_default=__datetime_func__,
        onupdate=__datetime_func__,
        nullable=False,
    )


def mapper_args(mapper_args_dict: dict[str, Any]) -> dict[str, Any]:
    return {**Model.__mapper_args__, **mapper_args_dict}


intpk = Annotated[int, mapped_column(init=False, primary_key=True)]
relationship = partial(db_relationship, lazy="selectin")

ModelType = TypeVar("ModelType", bound=Model)
