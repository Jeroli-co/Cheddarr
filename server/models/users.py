from enum import Enum

from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property

from server.core.config import get_config
from server.core.security import hash_password
from server.core.utils import get_random_avatar
from server.database import Model, Timestamp


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
    avatar = Column(String, default=get_random_avatar())
    confirmed = Column(Boolean, nullable=False, default=False)
    roles = Column(Integer, default=get_config().default_roles)
    plex_user_id = Column(Integer)
    plex_api_key = Column(String)

    @hybrid_property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, plain):
        self.password_hash = hash_password(plain)
