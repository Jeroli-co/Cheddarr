from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import check_password_hash, generate_password_hash
from server import db, utils


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), unique=True, nullable=False, index=True)
    email = db.Column(db.String(128), unique=True, nullable=False, index=True)
    _password = db.Column(db.String(128), nullable=False)
    user_picture = db.Column(db.String(256))
    session_token = db.Column(db.String(256))
    confirmed = db.Column(db.Boolean, default=False)
    oauth = db.relationship(
        "OAuth", backref="user", single_parent=True, cascade="delete, delete-orphan"
    )
    oauth_only = db.Column(db.Boolean, default=False)

    def __init__(
        self,
        username,
        email,
        password,
        user_picture=None,
        confirmed=False,
        oauth_only=False,
    ):
        self.username = username
        self.email = email
        self.password = password
        self.user_picture = user_picture
        self.confirmed = confirmed
        self.oauth_only = oauth_only
        self.session_token = utils.generate_token([email, password])

    def __repr__(self):
        return "%s/%s/%s/%s/%s/%s" % (
            self.username,
            self.email,
            self.user_picture,
            self.session_token,
            self.confirmed,
            self.oauth_only,
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
        self.oauth_only = False
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


class OAuth(OAuthConsumerMixin, db.Model):
    provider_user_id = db.Column(db.String(256), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
