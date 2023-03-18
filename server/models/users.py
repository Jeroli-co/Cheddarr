from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any
from uuid import uuid4

from passlib.context import CryptContext
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column

from server.core import security
from server.core.config import get_config
from server.core.utils import get_random_avatar

from .base import Model, Timestamp, intpk

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserRole(int, Enum):
    none = 0
    admin = 2
    request = 4
    manage_settings = 8
    manage_requests = 16
    manage_users = 32
    auto_approve = 64
    request_movies = 128
    request_series = 256


class User(Model, Timestamp):
    id: Mapped[intpk]
    username: Mapped[str] = mapped_column(unique=True, index=True, repr=True)
    email: Mapped[str | None] = mapped_column(unique=True, index=True, repr=True)
    _password_hash: Mapped[str]
    avatar: Mapped[str | None] = mapped_column(default=get_random_avatar())
    confirmed: Mapped[bool] = mapped_column(default=False, repr=True)
    roles: Mapped[int] = mapped_column(default=lambda: get_config().default_roles, repr=True)
    plex_user_id: Mapped[int | None]
    plex_api_key: Mapped[str | None]

    @hybrid_property
    def password(self) -> str:
        return self._password_hash

    @password.inplace.setter  # type: ignore
    def _password_setter(self, plain: str) -> None:
        self._password_hash = pwd_context.hash(plain)

    def verify_password(self, plain_password: str) -> bool:
        return pwd_context.verify(plain_password, self._password_hash)


class Token(Model, Timestamp):
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: uuid4().hex)
    max_uses: Mapped[int | None] = mapped_column(default=1)
    max_age: Mapped[int | None] = mapped_column(default=30)
    _signed_data: Mapped[str]

    @hybrid_property
    def data(self) -> Any:
        return self._signed_data

    @data.inplace.setter  # type: ignore
    def _data_setter(self, data: dict[str, Any]) -> None:
        self._signed_data = security.generate_token(data | {"id": self.id})

    @property
    def is_expired(self) -> bool:
        if self.max_age is None:
            return False
        return self.created_at + timedelta(minutes=self.max_age) < datetime.now(tz=timezone.utc)

    @classmethod
    def unsign(cls, signed_token: str) -> Any:
        return security.confirm_token(signed_token)
