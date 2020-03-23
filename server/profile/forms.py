from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired, FileAllowed
from wtforms import PasswordField, StringField, FileField
from wtforms.validators import Length, InputRequired


class ChangePasswordForm(FlaskForm):
    oldPassword = PasswordField("Old Password")
    newPassword = PasswordField("New Password", [InputRequired(), Length(min=8, max=128)])


class ChangeUsernameForm(FlaskForm):
    newUsername = StringField("New Username", [InputRequired(), Length(min=4, max=128)])


class PictureForm(FlaskForm):
    picture = FileField("Picture", [FileRequired(), FileAllowed(['jpg', 'jpeg', 'png', 'gif'])])
