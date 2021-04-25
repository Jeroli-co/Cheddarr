from enum import Enum
from typing import List, TYPE_CHECKING

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from server.core import config
from server.core.security import hash_password
from server.core.utils import get_random_avatar
from server.database import Model, Timestamp

if TYPE_CHECKING:
    from .settings import MediaProviderSetting, MediaServerSetting


class UserRole(int, Enum):
    none = 0
    admin = 2
    request = 4
    manage_settings = 8
    manage_requests = 16
    manage_users = 32
    auto_approve = 64


class User(Model, Timestamp):
    __repr_props__ = ("username", "email", "roles", "confirmed")

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    avatar = Column(String, default=get_random_avatar())
    confirmed = Column(Boolean, nullable=False, default=False)
    roles = Column(Integer, default=config.DEFAULT_ROLES)
    plex_user_id = Column(Integer)
    plex_api_key = Column(String)

    @hybrid_property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, plain):
        self.password_hash = hash_password(plain)

    media_servers: List["MediaServerSetting"] = relationship(
        "MediaServerSetting",
        secondary="usermediaserver",
        lazy="selectin",
        back_populates="users",
        cascade="all,delete",
    )
    media_providers: List["MediaProviderSetting"] = relationship(
        "MediaProviderSetting",
        lazy="selectin",
        cascade="all,delete,delete-orphan",
    )


class UserMediaServer(Model):
    __repr_props__ = ("user", "media_server")

    user_id = Column(ForeignKey("user.id"), primary_key=True)
    media_server_setting_id = Column(ForeignKey("mediaserversetting.id"), primary_key=True)

    user = relationship(
        "User", lazy="joined", innerjoin=True, backref="media_server_associations", viewonly=True
    )
    media_server = relationship(
        "MediaServerSetting",
        lazy="joined",
        innerjoin=True,
        backref="user_associations",
        viewonly=True,
    )
