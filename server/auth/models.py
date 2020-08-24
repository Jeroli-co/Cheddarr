import re
from uuid import uuid4

from flask_login import UserMixin
from sqlalchemy import and_
from sqlalchemy.orm import validates
from sqlalchemy_utils import EmailType, PasswordType, URLType

from server import utils
from server.extensions import db
from server.providers.models import ProviderConfig


class Friendship(db.Model):
    friend_a_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    friend_b_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    pending = db.Column(db.Boolean, default=True)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False)

    email = db.Column(EmailType, unique=True, nullable=False)
    password = db.Column(
        PasswordType(schemes=["pbkdf2_sha512", "md5_crypt"], deprecated=["md5_crypt"]),
        nullable=False,
    )

    @validates("password")
    def validate_password(self, key, password):
        assert 8 < len(password) < 128
        return password

    user_picture = db.Column(URLType)
    session_token = db.Column(db.String(256))
    confirmed = db.Column(db.Boolean, default=False)
    api_key = db.Column(db.String(256))
    friends_sent = db.relationship(
        "User",
        secondary=Friendship.__table__,
        primaryjoin=(Friendship.friend_a_id == id),
        secondaryjoin=(Friendship.friend_b_id == id),
        backref=db.backref("friends_received", lazy="dynamic"),
        lazy="dynamic",
    )
    providers_configs = db.relationship(ProviderConfig, backref="user", cascade="all")

    def __init__(
        self, username, email, password, user_picture=None, confirmed=False,
    ):
        self.username = username
        self.email = email
        self.password = password
        self.user_picture = user_picture
        self.confirmed = confirmed
        self.api_key = None
        self.session_token = utils.generate_token(str(uuid4()))

    def __repr__(self):
        return "%s/%s/%s/%s" % (
            self.username,
            self.email,
            self.user_picture,
            self.confirmed,
        )

    def get_id(self):
        return str(self.session_token)

    def change_password(self, new_password):
        self.password = new_password
        self.session_token = utils.generate_token(str(uuid4()))
        return db.session.commit()

    def change_email(self, new_email):
        self.email = new_email
        self.session_token = utils.generate_token(str(uuid4()))
        return db.session.commit()

    def save(self):
        db.session.add(self)
        return db.session.commit()

    def delete(self):
        db.session.delete(self)
        return db.session.commit()

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
        db.session.add(Friendship(friend_a_id=self.id, friend_b_id=user.id))
        return db.session.commit()

    def remove_friendship(self, friend):
        friendship = self.get_friendship(friend)
        db.session.delete(friendship)
        return db.session.commit()

    def confirm_friendship(self, friend):
        friendship = self.get_friendship(friend)
        friendship.pending = False
        return db.session.commit()

    def is_friend(self, user):
        return (
            self.friends_sent.filter(Friendship.friend_b_id == user.id).count()
            + self.friends_received.filter(Friendship.friend_a_id == user.id).count()
        ) > 0

    @classmethod
    def exists(cls, email=None, username=None):
        if email:
            return db.session.query(User.id).filter_by(email=email).scalar()
        if username:
            return db.session.query(User.id).filter_by(username=username).scalar()

    @classmethod
    def find(cls, email=None, username=None):
        if email:
            return cls.query.filter_by(email=email).one_or_none()
        if username:
            return cls.query.filter_by(username=username).one_or_none()
