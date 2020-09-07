from flask import request, session, url_for
from flask_login import current_user, fresh_login_required, login_required
from server import utils
from server.api.auth.models import User
from server.api.auth.schemas import UserSchema
from server.extensions import limiter, ma
from server.extensions.marshmallow import form
from server.tasks import send_email
from werkzeug.exceptions import BadRequest, Conflict, Forbidden, Gone

profile_serializer = UserSchema(only=["username", "avatar", "email"])


@login_required
def get_profile():
    return profile_serializer.jsonify(current_user)


@limiter.limit("3/hour")
@fresh_login_required
@form(UserSchema, only=["password"])
def delete_user(password):
    if not current_user.password == password:
        raise BadRequest("Wrong password.")

    current_user.delete()
    session.clear()
    return {"message": "User deleted."}


@limiter.limit("3/hour")
@fresh_login_required
@form(
    {"oldPassword": ma.String(required=True), "newPassword": ma.String(required=True)}
)
def change_password(oldPassword, newPassword):
    if not current_user.password == oldPassword:
        raise BadRequest("The passwords don't match.")

    current_user.change_password(newPassword)
    send_email.delay(
        current_user.email,
        "Your password has been changed",
        "email/change_password_notice.html",
    )
    return {"message": "User password changed."}


@form(UserSchema, only=["email", "password"])
def reset_password(email=None, password=None, token=None):
    if token is None:
        # Init reset password
        user = User.find(email=email)
        if not user:
            raise BadRequest("No user registered with this email.")
        token = utils.generate_timed_token([user.email, user.session_token])
        send_email.delay(
            email,
            "Reset your password",
            "email/reset_password_instructions.html",
            {
                "reset_url": url_for(
                    "profile.reset_password", token=token, _external=True
                )
            },
        )
        return {"message": "Reset instructions sent."}

    # Verify reset password token
    try:
        data = utils.confirm_timed_token(token)
    except Exception:
        raise Gone("The reset link is invalid or has expired.")

    user = User.find(email=data[0])
    session_token = data[1]
    if session_token != user.session_token:
        raise Forbidden("Reset password unavailable.")

    # Reset password
    if request.method == "POST":
        user.change_password(password)
        send_email.delay(
            user.email,
            "Your password has been reset",
            "email/reset_password_notice.html",
        )
        return {"message": "Password reset."}

    return {"message": "Able to reset."}


@limiter.limit("3/hour")
@fresh_login_required
@form(UserSchema, only=["username"])
def change_username(username):
    if User.exists(username=username):
        raise Conflict("This username is not available.")

    current_user.username = username
    current_user.save()
    return {"username": current_user.username}


@limiter.limit("3/hour")
@fresh_login_required
@form(UserSchema, only=["email"])
def change_email(email):

    if User.exists(email=email):
        raise Conflict("This email is already taken.")

    token = utils.generate_timed_token(email)
    send_email.delay(
        email,
        "Please confirm your new email",
        "email/email_confirmation.html",
        {"confirm_url": url_for("auth.confirm_email", token=token, _external=True)},
    )
    return {"message": "Confirmation email sent."}


"""
TODO: Implement later
@limiter.limit("10/hour")
@login_required
@form(UserSchema, only=["avatar"])
def change_picture(avatar):
    return {"avatar": current_user.avatar}
"""
