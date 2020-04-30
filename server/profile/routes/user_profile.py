from flask import render_template, session, url_for
from flask_login import current_user, fresh_login_required, login_required

from server import utils
from server.auth.forms import EmailForm, PasswordForm
from server.auth.models import User
from server.exceptions import BadRequest, Conflict, InternalServerError
from server.extensions import db, limiter
from server.profile.forms import ChangePasswordForm, PictureForm, UsernameForm
from server.profile.routes import profile
from server.profile.serializers.profile_serializer import profiles_serializer
from server.tasks import send_email


@profile.route("/", methods=["GET"])
@login_required
def get_profile():
    return profiles_serializer.jsonify(current_user)


@profile.route("/", methods=["DELETE"])
@limiter.limit("3/hour")
@fresh_login_required
def delete_user():
    password_form = PasswordForm()
    if not password_form.validate():
        raise InternalServerError(
            "Error while deleting the user.", payload=password_form.errors
        )

    if not current_user.password == password_form.password.data:
        raise BadRequest("Wrong password.")

    current_user.delete()
    session.clear()
    return {"message": "User deleted."}


@profile.route("/picture/", methods=["PUT"])
@limiter.limit("10/hour")
@login_required
def change_picture():
    picture_form = PictureForm()
    if not picture_form.validate():
        raise InternalServerError(
            "Error while changing the profile picture.", payload=picture_form.errors
        )

    picture = utils.upload_picture(picture_form.picture.data.stream)
    current_user.user_picture = picture
    db.session.commit()
    return {"user_picture": current_user.user_picture}


@profile.route("/password/", methods=["PUT"])
@limiter.limit("3/hour")
@fresh_login_required
def change_password():
    password_form = ChangePasswordForm()
    if not password_form.validate():
        raise InternalServerError(
            "Error while changing password.", payload=password_form.errors,
        )

    if not current_user.password == password_form.oldPassword.data:
        raise BadRequest("The passwords don't match.")

    current_user.change_password(password_form.newPassword.data)
    html = render_template("email/change_password_notice.html")
    subject = "Your password has been changed"
    send_email.delay(current_user.email, subject, html)
    return {"message": "User password changed."}


@profile.route("/username/", methods=["PUT"])
@limiter.limit("3/hour")
@fresh_login_required
def change_username():
    username_form = UsernameForm()
    if not username_form.validate():
        raise InternalServerError(
            "Error while changing username.", payload=username_form.errors
        )

    new_username = username_form.username.data
    if User.exists(username=new_username):
        raise Conflict("This username is not available.")

    current_user.username = new_username
    db.session.commit()
    return {"username": current_user.username}


@profile.route("/email/", methods=["PUT"])
@limiter.limit("3/hour")
@fresh_login_required
def change_email():
    email_form = EmailForm()
    if not email_form.validate():
        raise InternalServerError(
            "Error while changing email.", payload=email_form.errors
        )

    new_email = email_form.email.data
    if User.exists(email=new_email):
        raise Conflict("This email is already taken.")

    token = utils.generate_timed_token(new_email)
    confirm_url = url_for("auth.confirm_email", token=token, _external=True)
    html = render_template(
        "email/email_confirmation.html", confirm_url=confirm_url.replace("/api", "")
    )
    subject = "Please confirm your email"
    send_email.delay(new_email, subject, html)
    return {"message": "Confirmation email sent."}
