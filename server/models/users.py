from __future__ import annotations

from typing import List, Optional, TYPE_CHECKING

from sqlalchemy import Boolean, Column, ForeignKey, func, Integer, String
from sqlalchemy.orm import backref, relationship, Session, validates
from sqlalchemy_utils import EmailType, PasswordType, URLType

from server.core import utils
from server.database.model import Model

if TYPE_CHECKING:
    from server.schemas import UserCreate, UserUpdate  # noqa


class User(Model["User", "UserCreate", "UserUpdate"]):
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(EmailType, nullable=False, unique=True, index=True)
    password = Column(
        PasswordType(schemes=["pbkdf2_sha512", "md5_crypt"], deprecated=["md5_crypt"]),
        nullable=False,
    )
    avatar = Column(URLType)
    confirmed = Column(Boolean, default=False)
    admin = Column(Boolean, default=False)
    providers = relationship(
        "ProviderConfig", back_populates="user", cascade="all,delete", lazy="dynamic"
    )
    __repr_props__ = ("username", "email", "admin", "confirmed")

    @validates("password")
    def validate_password(self, key, password):
        assert len(password) >= 8
        return password

    @property
    def friends(self) -> List[User]:
        friendships = (
            self.requested_friends.filter_by(pending=False).union(
                self.received_friends.filter_by(pending=False)
            )
        ).all()
        return [
            friendship.receiving_user
            if friendship.receiving_user is not self
            else friendship.requesting_user
            for friendship in friendships
        ]

    @property
    def pending_requested_friends(self) -> List[User]:
        friendships = self.requested_friends.filter_by(pending=True).all()
        return [friendship.receiving_user for friendship in friendships]

    @property
    def pending_received_friends(self) -> List[User]:
        friendships = self.received_friends.filter_by(pending=True).all()
        return [friendship.requesting_user for friendship in friendships]

    def is_friend(self, user):
        return (
            self.requested_friends.filter_by(receiving_user_id=user.id).count()
            + self.received_friends.filter_by(requesting_user_id=user.id).count()
        ) > 0

    @classmethod
    def create(cls, db: Session, obj_in: UserCreate, commit=True) -> User:
        db_obj = User(
            username=obj_in.username,
            email=obj_in.email,
            password=obj_in.password,
            avatar=utils.random_avatar(),
        )
        db_obj.save(db, commit=commit)
        return db_obj

    @classmethod
    def get_by_email(cls, db: Session, email: str) -> Optional[User]:
        return db.query(cls).filter(cls.email == email).first()

    @classmethod
    def get_by_username(cls, db: Session, username: str) -> Optional[User]:
        return (
            db.query(cls).filter(func.lower(cls.username) == username.lower()).first()
        )

    @classmethod
    def get_by_username_or_email(cls, db: Session, username_or_email: str):
        return cls.get_by_email(db, email=username_or_email) or cls.get_by_username(
            db, username=username_or_email
        )


class Friendship(Model):
    requesting_user_id = Column(ForeignKey(User.id), primary_key=True)
    receiving_user_id = Column(ForeignKey(User.id), primary_key=True)
    requesting_user = relationship(
        "User",
        foreign_keys=[requesting_user_id],
        backref=backref("requested_friends", cascade="all,delete", lazy="dynamic"),
    )
    receiving_user = relationship(
        "User",
        foreign_keys=[receiving_user_id],
        backref=backref("received_friends", cascade="all,delete", lazy="dynamic"),
    )
    pending = Column(Boolean, default=True)

    @classmethod
    def get_by_user_ids(
        cls, db: Session, user_id: int, friend_id: int
    ) -> Optional[Friendship]:
        return (
            db.query(cls)
            .filter_by(requesting_user_id=user_id, receiving_user_id=friend_id)
            .one_or_none()
            or db.query(cls)
            .filter_by(requesting_user_id=friend_id, receiving_user_id=user_id)
            .one_or_none()
        )

    __repr_props__ = ("requesting_user", "receiving_user", "pending")
