from http import HTTPStatus

from flask import render_template
from flask_login import fresh_login_required, current_user, login_required

from server import InvalidUsage, db
from server.auth import utils, User
from server.auth.forms import PasswordForm
from server.settings import settings
from server.settings.forms import ChangeUsernameForm, ChangePasswordForm
from server.settings.serializers.user_serializer import UserSerializer


@login_required
@settings.route("/user/<username>")
def user_profile(username):
    user = User.find(username=username)
    if not user:
        raise InvalidUsage("The user does not exist", status_code=404)
    return UserSerializer().dumps(user)


@settings.route("/profile")
@login_required
def get_profile():
    return UserSerializer().dumps(current_user)


@settings.route("/profile/password", methods=["PUT"])
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while changing password",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=password_form.errors,
        )

    if current_user.password is not None and not current_user.check_password(
        password_form.oldPassword.data
    ):
        raise InvalidUsage(
            "Error while changing password", status_code=HTTPStatus.UNAUTHORIZED,
        )

    current_user.change_password(password_form.newPassword.data)
    html = render_template("email/change_password_notice.html")
    subject = "Your password has been chnaged"
    utils.send_email(current_user.email, subject, html)
    return {"message": "Password changed"}, HTTPStatus.OK


@settings.route("/profile/username", methods=["PUT"])
@fresh_login_required
def change_username():
    username_form = ChangeUsernameForm()
    if not username_form.validate():
        raise InvalidUsage(
            "Error while changing username",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    new_username = username_form.newUsername.data
    if User.exists(username=new_username):
        raise InvalidUsage(
            "This username is already taken", status_code=HTTPStatus.CONFLICT
        )

    current_user.username = username_form.newUsername.data
    db.session.commit()
    return {"message": "Username changed"}, HTTPStatus.OK


@settings.route("/profile", methods=["DELETE"])
@fresh_login_required
def delete_user():
    password_form = PasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while deleting user", status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )

    if not current_user.check_password(password_form.password.data):
        raise InvalidUsage("Wrong password", HTTPStatus.UNAUTHORIZED)

    User.delete_user(email=current_user.email)
    return {"message": "User deleted"}, HTTPStatus.OK
