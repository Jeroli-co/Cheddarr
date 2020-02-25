from server import db
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from sqlalchemy.ext.hybrid import hybrid_property
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, index=True)
    email = db.Column(db.String(50), unique=True, index=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(64))
    _password = db.Column(db.String, nullable=True)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        """Store the password as a hash for security."""
        self._password = generate_password_hash(value)

    def check_password(self, value):
        return check_password_hash(self.password, value)
