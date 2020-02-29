from flask_login import UserMixin
from flask_wtf import FlaskForm
from sqlalchemy.ext.hybrid import hybrid_property
from werkzeug.security import check_password_hash, generate_password_hash
from wtforms import StringField, BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.fields.simple import PasswordField
from wtforms.validators import DataRequired, Length

from server import db


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, index=True)
    email = db.Column(db.String(50), unique=True, index=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(64))
    _password = db.Column(db.String(64))
    confirmed = db.Column(db.Boolean, default=False)
    session_token = db.Column(db.String(64))

    def get_id(self):
        return str(self.session_token)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        """Store the password as a hash for security."""
        self._password = generate_password_hash(value)

    def check_password(self, value):
        return check_password_hash(self.password, value)


class SignupForm(FlaskForm):
    username = StringField("Username", [DataRequired()])
    email = EmailField("Email", [DataRequired()])
    firstName = StringField("First Name", [DataRequired()])
    lastName = StringField("Last Name", [DataRequired()])
    password = PasswordField("Password", [DataRequired(), Length(min=8)])


class SigninForm(FlaskForm):
    usernameOrEmail = StringField("Username Or Email", [DataRequired()])
    password = PasswordField("Password", [DataRequired()])
    remember = BooleanField("Remember", [DataRequired()])


class ChangePasswordForm(FlaskForm):
    oldPassword = PasswordField("Old Password", [DataRequired()])
    newPassword = PasswordField("New Password", [DataRequired(), Length(min=8)])