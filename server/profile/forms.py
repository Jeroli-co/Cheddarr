from flask_wtf import FlaskForm
from flask_wtf.file import FileRequired, FileAllowed
from wtforms import PasswordField, StringField, FileField
from wtforms.validators import Length, InputRequired, Regexp


class ChangePasswordForm(FlaskForm):
    oldPassword = PasswordField(
        "Old Password", [InputRequired(), Length(min=8, max=128)]
    )
    newPassword = PasswordField(
        "New Password", [InputRequired(), Length(min=8, max=128)]
    )


class UsernameForm(FlaskForm):
    username = StringField(
        "New Username",
        [InputRequired(), Length(min=4, max=128), Regexp(r"^[a-zA-Z0-9]+$")],
    )


class PictureForm(FlaskForm):
    picture = FileField(
        "Picture", [FileRequired(), FileAllowed(["jpg", "jpeg", "png", "gif"])]
    )
