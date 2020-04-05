from flask_wtf.file import FileAllowed, FileRequired
from wtforms import PasswordField, StringField, FileField
from wtforms.validators import Length, InputRequired
from server.auth.models import User
from server.forms import ModelForm


class ChangePasswordForm(ModelForm):
    oldPassword = PasswordField(
        "Old Password", [InputRequired(), Length(min=8, max=128)]
    )
    newPassword = PasswordField(
        "New Password", [InputRequired(), Length(min=8, max=128)]
    )


class UsernameForm(ModelForm):
    class Meta:
        model = User
        only = ["username"]


class UsernameOrEmailForm(ModelForm):
    usernameOrEmail = StringField(
        "Username or Email", [InputRequired(), Length(min=4, max=128)],
    )


class PictureForm(ModelForm):
    picture = FileField(
        "Picture", [FileRequired(), FileAllowed(["jpg", "jpeg", "png", "gif"])]
    )
