from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired
from wtforms import PasswordField, StringField, FileField
from wtforms.validators import DataRequired, Length


class ChangePasswordForm(FlaskForm):
    oldPassword = PasswordField("Old Password")
    newPassword = PasswordField("New Password", [DataRequired(), Length(min=8)])


class ChangeUsernameForm(FlaskForm):
    newUsername = StringField("New Username", [DataRequired()])


class PictureForm(FlaskForm):
    picture = FileField("Picture", [FileRequired()])
