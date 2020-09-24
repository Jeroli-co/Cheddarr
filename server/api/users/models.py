from uuid import uuid4

from flask_login import UserMixin
from sqlalchemy.orm import validates
from sqlalchemy_utils import EmailType, PasswordType, URLType

from server import utils
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


class User(Model, UserMixin):
    id = Column(Integer, primary_key=True)
    username = Column(String(128), unique=True, index=True)

    email = Column(EmailType, unique=True, index=True)
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
    providers = relationship("ProviderConfig", back_populates="user")

    __repr_props__ = ("username", "email", "confirmed")

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

    @property
    def friends(self):
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

    def get_pending_requested_friends(self):
        friendships = self.requested_friends.filter_by(pending=True).all()
        return [friendship.receiving_user for friendship in friendships]

    def get_pending_received_friends(self):
        friendships = self.received_friends.filter_by(pending=True).all()
        return [friendship.requesting_user for friendship in friendships]

    def is_friend(self, user):
        return (
            self.requested_friends.filter_by(receiving_user_id=user.id).count()
            + self.received_friends.filter_by(requesting_user_id=user.id).count()
        ) > 0


class Friendship(Model):
    requesting_user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
    receiving_user_id = Column(Integer, ForeignKey(User.id), primary_key=True)
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

    __repr_props__ = ("requesting_user", "receiving_user", "pending")

    def __init__(self, requesting_user, receiving_user):
        self.requesting_user = requesting_user
        self.receiving_user = receiving_user
