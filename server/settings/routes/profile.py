from http import HTTPStatus

from flask import render_template, session
from flask_login import fresh_login_required, current_user, login_required

from server import InvalidUsage, db, utils
from server.auth import User
from server.auth.forms import PasswordForm
from server.settings import settings
from server.settings.forms import ChangeUsernameForm, ChangePasswordForm, PictureForm
from server.settings.serializers.user_serializer import UserSerializer

user_serializer = UserSerializer()


@login_required
@settings.route("/user/<username>")
def user_profile(username):
    user = User.find(username=username)
    if not user:
        raise InvalidUsage("The user does not exist.", status_code=404)
    return user_serializer.dump(user), HTTPStatus.OK


@settings.route("/profile")
@login_required
def get_profile():
    return user_serializer.dump(current_user), HTTPStatus.OK


@settings.route("/profile/picture", methods=["PUT"])
@login_required
def change_picture():
    picture_form = PictureForm()
    if not picture_form.validate():
        raise InvalidUsage(
            "Error while changing the profile picture.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )
    response = utils.upload_picture(picture_form.picture.data.filename)
    print(response)
    current_user.user_picture = response["url"]
    db.session.commit()
    return {"user_picture": current_user.user_picture}, HTTPStatus.OK


@settings.route("/profile/password", methods=["PUT"])
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while changing password.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=password_form.errors,
        )

    if current_user.password is not None and not current_user.check_password(
        password_form.oldPassword.data
    ):
        raise InvalidUsage(
            "The passwords don't match.", status_code=HTTPStatus.UNAUTHORIZED,
        )

    current_user.change_password(password_form.newPassword.data)
    html = render_template("email/change_password_notice.html")
    subject = "Your password has been changed"
    utils.send_email(current_user.email, subject, html)
    return {"message": "User password changed."}, HTTPStatus.OK


@settings.route("/profile/username", methods=["PUT"])
@fresh_login_required
def change_username():
    username_form = ChangeUsernameForm()
    if not username_form.validate():
        raise InvalidUsage(
            "Error while changing username.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    new_username = username_form.newUsername.data
    if User.exists(username=new_username):
        raise InvalidUsage(
            "This username is not available.", status_code=HTTPStatus.CONFLICT
        )

    current_user.username = username_form.newUsername.data
    db.session.commit()
    return {"username": current_user.username}, HTTPStatus.OK


@settings.route("/profile", methods=["DELETE"])
@fresh_login_required
def delete_user():
    password_form = PasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while deleting the user.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    if current_user.password is not None and not current_user.check_password(
        password_form.password.data
    ):
        raise InvalidUsage("Wrong password.", HTTPStatus.UNAUTHORIZED)

    current_user.delete()
    session.clear()
    return {"message": "User deleted."}, HTTPStatus.OK
