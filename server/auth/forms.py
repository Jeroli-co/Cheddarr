from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Length, Email


class SignupForm(FlaskForm):
    username = StringField("Username", [DataRequired()])
    email = StringField("Email", [DataRequired(), Email()])
    firstName = StringField("First Name", [DataRequired()])
    lastName = StringField("Last Name", [DataRequired()])
    password = PasswordField("Password", [DataRequired(), Length(min=8)])


class SigninForm(FlaskForm):
    usernameOrEmail = StringField("Username Or Email", [DataRequired()])
    password = PasswordField("Password", [DataRequired()])
    remember = BooleanField("Remember")


class EmailForm(FlaskForm):
    email = EmailField("Email", [DataRequired()])


class ResetPasswordForm(FlaskForm):
    password = PasswordField("New Password", [DataRequired(), Length(min=8)])


class ChangePasswordForm(FlaskForm):
    oldPassword = PasswordField("Old Password", [DataRequired()])
    newPassword = PasswordField("New Password", [DataRequired(), Length(min=8)])
