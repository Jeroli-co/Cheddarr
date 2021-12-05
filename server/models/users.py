from enum import Enum
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import Boolean, Column, Enum as DBEnum, Integer, String

from server.core import security
from server.core.config import get_config
from server.core.security import hash_password
from server.core.utils import get_random_avatar
from server.models.base import Model, Timestamp

if TYPE_CHECKING:
    # This makes hybrid_property's have the same typing as normal property until stubs are improved.
    hybrid_property = property
else:
    from sqlalchemy.ext.hybrid import hybrid_property


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
    __repr_props__ = ("username", "email", "roles", "confirmed")

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    avatar = Column(String, default=get_random_avatar)
    confirmed = Column(Boolean, nullable=False, default=False)
    roles = Column(Integer, default=lambda: get_config().default_roles)
    plex_user_id = Column(Integer)
    plex_api_key = Column(String)

    @hybrid_property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, plain):
        self.password_hash = hash_password(plain)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class TokenType(str, Enum):
    invitation = "invitation"
    reset_password = "reset_password"


class Token(Model, Timestamp):
    id = Column(String, primary_key=True)
    max_uses = Column(Integer)
    type = Column(DBEnum(TokenType), nullable=False)
    signed_data = Column(String)

    def __init__(self, data, timed=True, **kwargs):
        super().__init__(**kwargs)
        self.id = uuid4().hex
        if timed is None:
            self.signed_data = security.generate_token(data | dict(id=self.id))
        else:
            self.signed_data = security.generate_timed_token(data | dict(id=self.id))

    @classmethod
    def unsign(cls, signed_token: str):
        return security.confirm_token(signed_token)

    @classmethod
    def time_unsign(cls, signed_token: str, max_age: int = 30):
        return security.confirm_timed_token(signed_token, max_age)
