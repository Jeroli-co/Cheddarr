from __future__ import annotations

from abc import ABC
from math import ceil
from typing import TYPE_CHECKING, Any, Generic, TypeVar, get_args, get_origin

import sqlalchemy as sa
from fastapi.encoders import jsonable_encoder

from server.models.base import ModelType

if TYPE_CHECKING:
    from collections.abc import Iterator

    from pydantic import BaseModel
    from sqlalchemy.ext.asyncio import AsyncSession


class BaseRepository(ABC, Generic[ModelType]):
    _type_arg: type[ModelType] | None = None

    def __init__(self, session: AsyncSession) -> None:
        """CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        :param session: A SQLAlchemy AsyncSession
        """
        self.session = session
        self.model = self.get_model()

    @classmethod
    def __init_subclass__(cls, **kwargs: Any) -> None:
        """Saves the type argument in the `_type_arg` class attribute."""
        super().__init_subclass__(**kwargs)
        for base in cls.__orig_bases__:  # type: ignore[attr-defined]
            origin = get_origin(base)
            if origin is None or not issubclass(origin, BaseRepository):
                continue
            type_arg = get_args(base)[0]
            if not isinstance(type_arg, TypeVar):
                cls._type_arg = type_arg
                return

    @classmethod
    def get_model(cls) -> type[ModelType]:
        """Get the model class from the type argument."""
        if cls._type_arg is None:
            raise AttributeError(f"{cls.__name__} is generic; type argument unspecified")
        if cls._type_arg.__mapper_args__.get("polymorphic_abstract"):
            raise ValueError(f"{cls._type_arg.__name__} is an abstract model")
        return cls._type_arg

    async def save(self, db_obj: ModelType) -> ModelType:
        """Persist an object to the database

        :param db_obj: Database object to be persisted
        """
        self.session.add(db_obj)
        await self.session.commit()
        return db_obj

    async def update(
        self,
        db_obj: ModelType,
        obj_in: BaseModel | dict[str, Any],
    ) -> ModelType:
        """Update an object's in the database

        :param db_obj: Database object to be updated
        :param obj_in: The schema or dict of attributes to update the object
        :return: The updated object
        """
        obj_data = jsonable_encoder(db_obj)
        update_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])

        await self.save(db_obj)
        return db_obj

    async def remove(self, db_obj: ModelType) -> None:
        """Delete an object from the database

        :param db_obj: Database object to be deleted
        """
        await self.session.delete(db_obj)
        await self.session.commit()

    def select(self, statement: sa.Select[Any]) -> Select[ModelType]:
        """Create a `.Select` object from a SQLAlchemy select statement

        :param statement: The SQLAlchemy select statement
        """
        return Select(statement, self.session)

    def find_by(self, **filters: Any) -> Select[ModelType]:
        """Find an object by its attributes

        :param filters: The attributes to filter by
        :return: A `.Find` object
        """
        statement = sa.select(self.model).filter_by(**filters)
        return self.select(statement)

    def search_by(self, field: str, value: str) -> Select[ModelType]:
        """Search for objects containing a value in a field

        :param field: The field to search in
        :param value: The value to search for
        """
        statement = sa.select(self.model).where(getattr(self.model, field).contains(value))
        return self.select(statement)

    async def count(self, **filters: Any) -> int:
        """Count the number of objects in the database matching the given filters

        :param filters: The attributes to filter by
        """
        result = await self.session.execute(
            sa.select(self.model).filter_by(**filters).with_only_columns(sa.func.count()),
        )
        return result.scalar_one()


class Select(Generic[ModelType]):
    """A SQLAlchemy select statement with methods for execution"""

    def __init__(self, select: sa.Select[Any], session: AsyncSession) -> None:
        self._select: sa.Select[Any] = select
        self._session: AsyncSession = session

    async def one(self) -> ModelType | None:
        """Execute the select statement and return the first result or None"""
        return (await self._session.execute(self._select)).scalar_one_or_none()

    async def all(self) -> list[ModelType]:
        """Execute the select statement and return all results"""
        return list((await self._session.execute(self._select)).scalars().all())

    async def paginate(
        self,
        *,
        page: int | None = None,
        per_page: int | None = None,
        max_per_page: int | None = None,
    ) -> Pagination[ModelType]:
        """Apply an offset and limit to a select statement based on the current page and
        number of items per page, returning a py:class:`.Pagination` object.
        """
        p: Pagination[ModelType] = Pagination(
            select=self._select,
            session=self._session,
            page=page,
            per_page=per_page,
            max_per_page=max_per_page,
        )
        return await p.query()


class Pagination(Generic[ModelType]):
    """Apply an offset and limit to a select statement based on the current page and number of
    items per page.

    :param select: The select statement to paginate.
    :param session: The session to use to execute the query.
    :param page: The current page, used to calculate the offset. Defaults to the
        ``page`` query arg during a request, or 1 otherwise.
    :param per_page: The maximum number of items on a page, used to calculate the
        offset and limit. Defaults to the ``per_page`` query arg during a request,
        or 20 otherwise.
    :param max_per_page: The maximum allowed value for ``per_page``, to limit a
        user-provided value. Use ``None`` for no limit. Defaults to 100.
    """

    def __init__(
        self,
        select: sa.Select[Any],
        session: AsyncSession,
        page: int | None = None,
        per_page: int | None = None,
        max_per_page: int | None = 100,
    ) -> None:
        page, per_page = self._prepare_page_args(
            page=page,
            per_page=per_page,
            max_per_page=max_per_page,
        )
        self._select: sa.Select[Any] = select

        self._session: AsyncSession = session

        self.page: int = page

        self.per_page: int = per_page

        self.items: list[ModelType] = []

        self.total: int | None = None

    @staticmethod
    def _prepare_page_args(
        *,
        page: int | None = None,
        per_page: int | None = None,
        max_per_page: int | None = None,
    ) -> tuple[int, int]:
        if page is None or page < 1:
            page = 1

        if per_page is None or per_page < 1:
            per_page = 20

        if max_per_page is not None:
            per_page = min(per_page, max_per_page)

        return page, per_page

    async def query(self) -> Pagination[ModelType]:
        """Execute the query to get the items on the current page."""
        self.items = await self._query_items()
        if self.page == 1 and len(self.items) < self.per_page:
            self.total = len(self.items)
        else:
            self.total = await self._query_count()
        return self

    @property
    def _query_offset(self) -> int:
        """The index of the first item to query, passed to ``offset()``."""
        return (self.page - 1) * self.per_page

    async def _query_items(self) -> list[ModelType]:
        """Execute the query to get the items on the current page."""
        statement = self._select.limit(self.per_page).offset(self._query_offset)
        return list(await self._session.scalars(statement))

    async def _query_count(self) -> int | None:
        """Execute the query to get the total number of items."""
        statement = self._select.with_only_columns(sa.func.count())
        return await self._session.scalar(statement)

    @property
    def first(self) -> int:
        """The number of the first item on the page, starting from 1, or 0 if there are no items."""
        if len(self.items) == 0:
            return 0

        return (self.page - 1) * self.per_page + 1

    @property
    def last(self) -> int:
        """The number of the last item on the page, starting from 1, inclusive, or 0 if there are no items."""
        first = self.first
        return max(first, first + len(self.items) - 1)

    @property
    def pages(self) -> int:
        """The total number of pages."""
        if self.total == 0 or self.total is None:
            return 0

        return ceil(self.total / self.per_page)

    @property
    def has_prev(self) -> bool:
        """``True`` if this is not the first page."""
        return self.page > 1

    @property
    def prev_num(self) -> int | None:
        """The previous page number, or ``None`` if this is the first page."""
        if not self.has_prev:
            return None

        return self.page - 1

    def prev(self) -> Pagination[ModelType]:
        """Query the :class:`Pagination` object for the previous page."""
        p = type(self)(
            select=self._select,
            session=self._session,
            page=self.page - 1,
            per_page=self.per_page,
        )
        p.total = self.total
        return p

    @property
    def has_next(self) -> bool:
        """``True`` if this is not the last page."""
        return self.page < self.pages

    @property
    def next_num(self) -> int | None:
        """The next page number, or ``None`` if this is the last page."""
        if not self.has_next:
            return None

        return self.page + 1

    def next(self) -> Pagination[ModelType]:
        """Query the :class:`Pagination` object for the next page."""
        p = type(self)(
            select=self._select,
            session=self._session,
            page=self.page + 1,
            per_page=self.per_page,
        )
        p.total = self.total
        return p

    def iter_pages(
        self,
        *,
        left_edge: int = 2,
        left_current: int = 2,
        right_current: int = 4,
        right_edge: int = 2,
    ) -> Iterator[int | None]:
        """Yield page numbers for a pagination widget. Skipped pages between the edges
        and middle are represented by a ``None``.

        :param left_edge: How many pages to show from the first page.
        :param left_current: How many pages to show left of the current page.
        :param right_current: How many pages to show right of the current page.
        :param right_edge: How many pages to show from the last page.
        """
        pages_end = self.pages + 1

        if pages_end == 1:
            return

        left_end = min(1 + left_edge, pages_end)
        yield from range(1, left_end)

        if left_end == pages_end:
            return

        mid_start = max(left_end, self.page - left_current)
        mid_end = min(self.page + right_current + 1, pages_end)

        if mid_start - left_end > 0:
            yield None

        yield from range(mid_start, mid_end)

        if mid_end == pages_end:
            return

        right_start = max(mid_end, pages_end - right_edge)

        if right_start - mid_end > 0:
            yield None

        yield from range(right_start, pages_end)

    def __iter__(self) -> Iterator[Any]:
        yield from self.items
