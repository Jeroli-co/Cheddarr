from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import check_password_hash, generate_password_hash
from server import db, utils


friendships = db.Table(
    "friendships",
    db.metadata,
    db.Column("friend_a_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("friend_b_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
)

friend_requests = db.Table(
    "friend_requests",
    db.metadata,
    db.Column("requesting_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("receiving_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False, index=True)
    email = db.Column(db.String(128), unique=True, nullable=False, index=True)
    _password = db.Column(db.String(128), nullable=False)
    api_key = db.Column(db.String)
    user_picture = db.Column(db.String(256))
    session_token = db.Column(db.String(256))
    confirmed = db.Column(db.Boolean, default=False)
    friend_requests_sent = db.relationship(
        "User",
        secondary=friend_requests,
        primaryjoin=(friend_requests.c.requesting_id == id),
        secondaryjoin=(friend_requests.c.receiving_id == id),
        backref=db.backref("friend_requests_received", lazy="dynamic"),
        lazy="dynamic",
    )
    friends = db.relationship(
        "User",
        secondary=friendships,
        primaryjoin=(friendships.c.friend_a_id == id),
        secondaryjoin=(friendships.c.friend_b_id == id),
        backref=db.backref("friends_approved", lazy="dynamic"),
        lazy="dynamic",
    )

    def get_friends(self):
        return []

    def is_friend_pending(self, user):
        return (
            self.friend_requests_received.filter(
                friend_requests.c.requesting_id == user.id
            ).count()
            + self.friend_requests_sent.filter(
                friend_requests.c.receiving_id == user.id
            ).count()
            > 0
        )

    def is_friend(self, user):
        return (
            self.friends.filter(friendships.c.friend_b_id == user.id).count()
            + self.friends_approved.filter(friendships.c.friend_a_id == user.id).count()
        )

    def add_friend(self, user):
        if not self.is_friend(user):
            self.friend_requests_sent.append(user)
            db.session.commit()

    def remove_friend(self, user):
        if self.is_friend_pending(user):
            self.friend_requests_sent.remove(user)
        elif self.is_friend(user):
            pass
        db.session.commit()

    def __init__(
        self, username, email, password, user_picture=None, confirmed=False,
    ):
        self.username = username
        self.email = email
        self.password = password
        self.user_picture = user_picture
        self.confirmed = confirmed
        self.session_token = utils.generate_token([email, password])
        self.api_key = None

    def __repr__(self):
        return "%s/%s/%s/%s" % (
            self.username,
            self.email,
            self.user_picture,
            self.confirmed,
        )

    def get_id(self):
        return str(self.session_token)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        """Store the password as a hash for security."""
        if value is not None:
            self._password = generate_password_hash(value)

    def check_password(self, value):
        return check_password_hash(self.password, value)

    def change_password(self, new_password):
        self.password = new_password
        self.session_token = utils.generate_token([self.email, self.password])
        db.session.commit()

    def change_email(self, new_email):
        self.email = new_email
        self.session_token = utils.generate_token([self.email, self.password])
        db.session.commit()

    def delete(self):
        user = User.query.filter_by(id=self.id).first()
        db.session.delete(user)
        db.session.commit()

    @classmethod
    def exists(cls, email=None, username=None):
        if email:
            return db.session.query(User.id).filter_by(email=email).scalar()
        if username:
            return db.session.query(User.id).filter_by(username=username).scalar()

    @classmethod
    def find(cls, email=None, username=None):
        if email:
            return User.query.filter_by(email=email).first()
        if username:
            return User.query.filter_by(username=username).first()
