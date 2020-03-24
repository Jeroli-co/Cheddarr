from http import HTTPStatus

from flask import render_template, session, url_for
from flask_login import fresh_login_required, current_user, login_required

from server import InvalidUsage, db, utils
from server.auth.models import User
from server.auth.forms import PasswordForm, EmailForm
from server.profile import profile
from server.profile.forms import UsernameForm, ChangePasswordForm, PictureForm
from server.profile.serializers.user_serializer import ProfileSerializer


profile_serializer = ProfileSerializer()


@profile.route("/", methods=["GET"])
@login_required
def get_profile():
    return profile_serializer.dump(current_user), HTTPStatus.OK


@profile.route("/", methods=["DELETE"])
@fresh_login_required
def delete_user():
    password_form = PasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while deleting the user.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    if not current_user.check_password(password_form.password.data):
        raise InvalidUsage("Wrong password.", HTTPStatus.BAD_REQUEST)

    current_user.delete()
    session.clear()
    return {"message": "User deleted."}, HTTPStatus.OK


@profile.route("/profile/picture", methods=["PUT"])
@login_required
def change_picture():
    picture_form = PictureForm()
    if not picture_form.validate():
        raise InvalidUsage(
            "Error while changing the profile picture.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )
    response = utils.upload_picture(picture_form.picture.data.stream)
    current_user.user_picture = response["secure_url"]
    db.session.commit()
    return {"user_picture": current_user.user_picture}, HTTPStatus.OK


@profile.route("/password", methods=["PUT"])
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if not password_form.validate():
        raise InvalidUsage(
            "Error while changing password.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=password_form.errors,
        )

    if not current_user.check_password(password_form.oldPassword.data):
        raise InvalidUsage(
            "The passwords don't match.", status_code=HTTPStatus.BAD_REQUEST,
        )

    current_user.change_password(password_form.newPassword.data)
    html = render_template("email/change_password_notice.html")
    subject = "Your password has been changed"
    utils.send_email(current_user.email, subject, html)
    return {"message": "User password changed."}, HTTPStatus.OK


@profile.route("/username", methods=["PUT"])
@fresh_login_required
def change_username():
    username_form = UsernameForm()
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

    current_user.username = new_username
    db.session.commit()
    return {"username": current_user.username}, HTTPStatus.OK


@profile.route("/email", methods=["PUT"])
@fresh_login_required
def change_email():
    email_form = EmailForm()
    if not email_form.validate():
        raise InvalidUsage(
            "Error while changing email.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    new_email = email_form.email.data
    if User.exists(email=new_email):
        raise InvalidUsage(
            "This email is already taken.", status_code=HTTPStatus.CONFLICT
        )

    token = utils.generate_timed_token(new_email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/email_confirmation.html", confirm_url=confirm_url.replace("/api", "")
    )
    subject = "Please confirm your email"
    utils.send_email(new_email, subject, html)
    return {"message": "Confirmation email sent."}, HTTPStatus.OK
