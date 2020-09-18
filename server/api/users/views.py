from flask import request, session, url_for
from flask_login import current_user, fresh_login_required, login_required
from marshmallow import fields
from marshmallow.validate import OneOf
from server import utils
from server.extensions import limiter
from server.extensions.marshmallow import body, form, query
from server.tasks import send_email
from werkzeug.exceptions import BadRequest, Conflict, Forbidden, Gone, NotFound

from .models import Friendship, User
from .schemas import UserSchema, profile_serializer, user_serializer


@login_required
def get_user(id=None, username=None):
    if id is not None:
        user = User.find(id=id)
        if not user:
            raise NotFound("No user with this id exists.")
        return profile_serializer.jsonify(user)
    if username is not None:
        user = User.find(username=username)
        if not user:
            raise NotFound("No user with this name exists.")
        return profile_serializer.jsonify(user)

    return user_serializer.jsonify(current_user)


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
    {
        "oldPassword": fields.String(required=True),
        "newPassword": fields.String(required=True),
    }
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


@limiter.limit("10/hour")
@body(UserSchema, only=["username", "email"])
def update_user(fields):
    if "username" in fields.keys():
        username = fields["username"]
        if User.exists(username=username):
            raise Conflict("This username is not available.")
        current_user.username = username

    if "email" in fields.keys():
        email = fields["email"]
        if User.exists(email=email):
            raise Conflict("This email is already taken.")
        token = utils.generate_timed_token(email)
        send_email.delay(
            email,
            "Please confirm your new email",
            "email/email_confirmation.html",
            {"confirm_url": url_for("auth.confirm_email", token=token, _external=True)},
        )

    current_user.save()
    return user_serializer.jsonify(current_user)


@login_required
def get_friends():
    return profile_serializer.jsonify(current_user.friends, many=True)


@login_required
def get_received_friends():
    return profile_serializer.jsonify(
        current_user.get_pending_received_friends(), many=True
    )


@login_required
def get_requested_friends():
    return profile_serializer.jsonify(
        current_user.get_pending_requested_friends(), many=True
    )


@login_required
@form({"usernameOrEmail": fields.String(required=True)})
def add_friend(usernameOrEmail):
    friend = User.find(username=usernameOrEmail) or User.find(email=usernameOrEmail)
    if not friend or friend == current_user:
        raise BadRequest("The user does not exist.")

    if current_user.is_friend(friend):
        raise Conflict("This user is already your friend.")

    friendship = Friendship(requesting_user=current_user, receiving_user=friend)
    friendship.save()

    return profile_serializer.jsonify(friend)


@login_required
def remove_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    friendship = Friendship.find(
        requesting_user=friend, receiving_user=current_user
    ) or Friendship.find(receiving_user=friend, requesting_user=current_user)
    if not friendship:
        raise BadRequest("This user is not in your friend list.")

    friendship.delete()
    return {"message": "Friend removed."}


@login_required
def accept_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    friendship = Friendship.find(
        requesting_user=friend, receiving_user=current_user
    ) or Friendship.find(receiving_user=friend, requesting_user=current_user)
    if not friendship:
        raise BadRequest("This user is not in your friend list.")

    friendship.pending = False
    friendship.save()
    return profile_serializer.jsonify(friend)


@fresh_login_required
def get_api_key():
    return {"key": current_user.api_key}


@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    current_user.save()
    return {"message": "API key deleted"}


@limiter.limit("3/hour")
@fresh_login_required
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    current_user.save()
    return {"key": current_user.api_key}


@login_required
@query({"type": fields.String(validate=OneOf(["movies", "series"]))})
def get_friends_providers(type):

    friends = current_user.friends
    if type == "movies":
        friends_available = [
            friend
            for friend in friends
            for provider in friend.providers
            if provider.provides_movies()
        ]
    else:
        friends_available = [
            friend
            for friend in friends
            for provider in friend.providers
            if provider.provides_series()
        ]

    return profile_serializer.jsonify(friends_available, many=True)
