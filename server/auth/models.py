from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import check_password_hash, generate_password_hash
from server import db
from server.auth import utils


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, index=True)
    email = db.Column(db.String(50), unique=True, index=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(64))
    _password = db.Column(db.String(128), nullable=True)
    confirmed = db.Column(db.Boolean, default=False)
    session_token = db.Column(db.String(64))

    def __repr__(self):
        return "%s/%s/%s/%s/%s" % (
            self.username,
            self.email,
            self.first_name,
            self.last_name,
            self.password,
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

    @classmethod
    def exists(cls, email=None):
        return db.session.query(User.id).filter_by(email=email).scalar()

    @classmethod
    def find(cls, email=None, username=None):
        if email:
            return User.query.filter_by(email=email).first()
        if username:
            return User.query.filter_by(username=username).first()
        return None

    @classmethod
    def create_user(cls, first_name, last_name, email, username, password=None):
        user = User(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            confirmed=False if password is not None else True,
        )
        if user.password:
            user.session_token = utils.generate_token([user.email, user.password])
        else:
            user.session_token = utils.generate_token([user.email])
        return user


class OAuth(OAuthConsumerMixin, db.Model):
    provider_user_id = db.Column(db.String(256), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    user = db.relationship(User)
