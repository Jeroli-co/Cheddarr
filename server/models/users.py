from enum import auto, Enum

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import backref, relationship

from server.core.security import hash_password
from server.core.utils import get_random_avatar
from server.database import Model


class UserRole(int, Enum):
    admin = 2
    request = auto()
    manage_settings = auto()
    auto_approve = auto()


class User(Model):
    __repr_props__ = ("username", "email", "roles", "confirmed")

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    avatar = Column(String)
    confirmed = Column(Boolean, nullable=False, default=False)
    roles = Column(Integer)
    plex_user_id = Column(Integer)
    plex_api_key = Column(String)

    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all,delete,delete-orphan",
    )
    media_servers = relationship(
        "MediaServerSetting",
        back_populates="user",
        cascade="all,delete,delete-orphan",
    )
    media_providers = relationship(
        "MediaProviderSetting",
        back_populates="user",
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
        backref=backref("outgoing_friendships", cascade="all,delete,delete-orphan"),
    )
    requested_user = relationship(
        "User",
        foreign_keys=[requested_user_id],
        backref=backref("incoming_friendships", cascade="all,delete,delete-orphan"),
    )
