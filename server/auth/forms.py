from wtforms import BooleanField, StringField
from wtforms.validators import InputRequired, Length

from server.auth.models import User
from server.forms import ModelForm


class SignupForm(ModelForm):
    class Meta:
        model = User
        only = ["username", "email", "password"]


class SigninForm(ModelForm):
    class Meta:
        model = User
        only = ["password"]

    usernameOrEmail = StringField(
        "Username Or Email", [InputRequired(), Length(min=4, max=128)]
    )
    remember = BooleanField("Remember")


class EmailForm(ModelForm):
    class Meta:
        model = User
        only = ["email"]


class PasswordForm(ModelForm):
    class Meta:
        model = User
        only = ["password"]
