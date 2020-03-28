from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.validators import Length, Email, InputRequired, Regexp


class SignupForm(FlaskForm):
    username = StringField(
        "Username", [InputRequired(), Length(min=4, max=128), Regexp(r"^[a-zA-Z0-9]+$")]
    )
    email = StringField("Email", [InputRequired(), Email(), Length(min=4, max=128)])
    password = PasswordField("Password", [InputRequired(), Length(min=8, max=128)])


class SigninForm(FlaskForm):
    usernameOrEmail = StringField(
        "Username Or Email", [InputRequired(), Length(min=4, max=128)]
    )
    password = PasswordField("Password", [InputRequired(), Length(min=8, max=128)])
    remember = BooleanField("Remember")


class EmailForm(FlaskForm):
    email = EmailField("Email", [InputRequired(), Length(min=4, max=128)])


class PasswordForm(FlaskForm):
    password = PasswordField("Password", [InputRequired(), Length(min=8, max=128)])
