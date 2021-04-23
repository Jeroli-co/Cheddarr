from enum import auto, Enum
from typing import List

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import backref, relationship

from server.core.security import hash_password
from server.core.utils import get_random_avatar
from server.database import Model, Timestamp
from server.models.settings import MediaProviderSetting, MediaServerSetting


class UserRole(int, Enum):
    none = 0
    admin = 2
    request = 4
    manage_settings = 8
    auto_approve = 16


class User(Model, Timestamp):
    __repr_props__ = ("username", "email", "roles", "confirmed")

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    avatar = Column(String)
    confirmed = Column(Boolean, nullable=False, default=False)
    roles = Column(Integer, default=UserRole.admin)  # FIXME: change to UserRole.none
    plex_user_id = Column(Integer)
    plex_api_key = Column(String)

    media_servers: List[MediaServerSetting] = relationship(
        "MediaServerSetting",
        lazy="selectin",
        cascade="all,delete,delete-orphan",
    )
    media_providers: List[MediaProviderSetting] = relationship(
        "MediaProviderSetting",
        lazy="selectin",
        cascade="all,delete,delete-orphan",
    )

    @hybrid_property
    def password(self):
        return self.password_hash

    @password.setter
    def password(self, plain):
        self.password_hash = hash_password(plain)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if "avatar" not in kwargs:
            self.avatar = get_random_avatar()


class Friendship(Model):
    __repr_props__ = ("requesting_user", "requested_user", "pending")

    pending = Column(Boolean, default=True)
    requesting_user_id = Column(ForeignKey(User.id), primary_key=True)
    requested_user_id = Column(ForeignKey(User.id), primary_key=True)

    requesting_user = relationship(
        "User",
        foreign_keys=[requesting_user_id],
        lazy="joined",
        innerjoin=True,
        backref=backref("outgoing_friendships", cascade="all,delete,delete-orphan"),
    )
    requested_user = relationship(
        "User",
        foreign_keys=[requested_user_id],
        lazy="joined",
        innerjoin=True,
        backref=backref("incoming_friendships", cascade="all,delete,delete-orphan"),
    )
