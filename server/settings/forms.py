from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import DataRequired, Length


class ChangePasswordForm(FlaskForm):
    oldPassword = PasswordField("Old Password")
    newPassword = PasswordField("New Password", [DataRequired(), Length(min=8)])


class ChangeUsernameForm(FlaskForm):
    newUsername = StringField("New Username", [DataRequired()])
