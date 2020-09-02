from uuid import uuid4

from flask_login import UserMixin
from server import utils
from server.api.providers.models import ProviderConfig
from server.database import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    Model,
    String,
    backref,
    relationship,
    session,
)
from sqlalchemy import and_
from sqlalchemy.orm import validates
from sqlalchemy_utils import EmailType, PasswordType, URLType


class Friendship(Model):
    friend_a_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    friend_b_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    pending = Column(Boolean, default=True)


class User(Model, UserMixin):
    id = Column(Integer, primary_key=True)
    username = Column(String(128), unique=True)

    email = Column(EmailType, unique=True)
    password = Column(
        PasswordType(schemes=["pbkdf2_sha512", "md5_crypt"], deprecated=["md5_crypt"]),
    )

    @validates("password")
    def validate_password(self, key, password):
        assert 8 <= len(password) <= 128
        return password

    avatar = Column(URLType, nullable=True)
    session_token = Column(String(256))
    confirmed = Column(Boolean, default=False)
    api_key = Column(String(256), nullable=True)
    friends_sent = relationship(
        "User",
        secondary=Friendship.__table__,
        primaryjoin=(Friendship.friend_a_id == id),
        secondaryjoin=(Friendship.friend_b_id == id),
        backref=backref("friends_received", lazy="dynamic"),
        lazy="dynamic",
    )
    providers_configs = relationship(ProviderConfig, back_populates="user")

    def __init__(
        self,
        username,
        email,
        password,
        avatar=None,
        confirmed=False,
    ):
        self.username = username
        self.email = email
        self.password = password
        self.avatar = avatar
        self.confirmed = confirmed
        self.api_key = None
        self.session_token = utils.generate_token(str(uuid4()))

    def __repr__(self):
        return "%s/%s/%s/%s" % (
            self.username,
            self.email,
            self.avatar,
            self.confirmed,
        )

    def get_id(self):
        return str(self.session_token)

    def change_password(self, new_password):
        self.password = new_password
        self.session_token = utils.generate_token(str(uuid4()))
        return session.commit()

    def change_email(self, new_email):
        self.email = new_email
        self.session_token = utils.generate_token(str(uuid4()))
        return session.commit()

    def save(self):
        session.add(self)
        return session.commit()

    def delete(self):
        session.delete(self)
        return session.commit()

    def get_friendship(self, friend):
        friendship = (
            Friendship.query.filter(
                and_(
                    Friendship.friend_a_id == self.id,
                    Friendship.friend_b_id == friend.id,
                )
            )
            .union(
                Friendship.query.filter(
                    and_(
                        Friendship.friend_b_id == self.id,
                        Friendship.friend_a_id == friend.id,
                    )
                )
            )
            .first()
        )
        return friendship

    def get_friendships(self):
        return (
            self.friends_sent.filter(Friendship.pending == False).union(
                self.friends_received.filter(Friendship.pending == False)
            )
        ).all()

    def get_pending_requested(self):
        return self.friends_sent.filter(Friendship.pending == True).all()

    def get_pending_received(self):
        return self.friends_received.filter(Friendship.pending == True).all()

    def add_friendship(self, user):
        session.add(Friendship(friend_a_id=self.id, friend_b_id=user.id))
        return session.commit()

    def remove_friendship(self, friend):
        friendship = self.get_friendship(friend)
        session.delete(friendship)
        return session.commit()

    def confirm_friendship(self, friend):
        friendship = self.get_friendship(friend)
        friendship.pending = False
        return session.commit()

    def is_friend(self, user):
        return (
            self.friends_sent.filter(Friendship.friend_b_id == user.id).count()
            + self.friends_received.filter(Friendship.friend_a_id == user.id).count()
        ) > 0
