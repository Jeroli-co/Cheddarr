from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import check_password_hash, generate_password_hash
from server import db, utils


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False, index=True)
    email = db.Column(db.String(128), unique=True, nullable=False, index=True)
    _password = db.Column(db.String(128), nullable=False)
    api_key = db.Column(db.String)
    user_picture = db.Column(db.String(256))
    session_token = db.Column(db.String(256))
    confirmed = db.Column(db.Boolean, default=False)

    def __init__(
        self,
        username,
        email,
        password,
        user_picture=None,
        confirmed=False,
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
            self.confirmed
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

    def add_friend(self, user):
        if not self.is_friend(user):
            self.friends.append(user)
            db.session.commit()

    def remove_friend(self, user):
        if self.is_friend(user):
            self.friends.remove(user)
            db.session.commit()

    def is_friend(self, user):
        return self.friends.filter(friendship.c.friend_b_id == user.id).count() > 0

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
