from flask import request, session, url_for, Blueprint
from flask_login import current_user, fresh_login_required, login_required
from werkzeug.exceptions import BadRequest, Conflict, Forbidden, Gone, NotFound

from server import utils
from server.extensions import limiter
from server.extensions.marshmallow import body, form, query, jsonify_with
from server.models import Friendship, User
from server.schemas import (
    UserSchema,
    ChangePasswordSchema,
    AddFriendSchema,
    GetFriendProvidersSchema,
)
from server.tasks import send_email

users_bp = Blueprint("users", __name__)

profile_serializer = UserSchema(only=["username", "avatar", "email", "_links"])
user_serializer = UserSchema(exclude=["password", "api_key"])


@users_bp.route("/user/")
@users_bp.route("/users/<int:id>/")
@users_bp.route("/users/<username>/")
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


@users_bp.route("/user/", methods=["DELETE"])
@fresh_login_required
@limiter.limit("3/hour")
@form(UserSchema, only=["password"])
def delete_user(password):
    if not current_user.password == password:
        raise BadRequest("Wrong password.")

    current_user.delete()
    session.clear()
    return {"message": "User deleted."}


@users_bp.route("/user/password/", methods=["PUT"])
@fresh_login_required
@limiter.limit("3/hour")
@form(ChangePasswordSchema)
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


@users_bp.route("/user/password/reset/", methods=["POST"])
@users_bp.route("/user/password/reset/<token>/", methods=["GET", "POST"])
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
            {"reset_url": url_for("users.reset_password", token=token, _external=True)},
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


@users_bp.route("/user/", methods=["PATCH"])
@limiter.limit("10/hour")
@body(UserSchema, only=["username", "email"])
@jsonify_with(user_serializer)
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
    return current_user


@users_bp.route("/user/friends/")
@login_required
@jsonify_with(profile_serializer, many=True)
def get_friends():
    return current_user.friends


@users_bp.route("/user/friends/received/")
@login_required
@jsonify_with(profile_serializer, many=True)
def get_received_friends():
    return current_user.get_pending_received_friends()


@users_bp.route("/user/friends/requested/")
@login_required
@jsonify_with(profile_serializer, many=True)
def get_requested_friends():
    return current_user.get_pending_requested_friends()


@users_bp.route("/user/friends/", methods=["POST"])
@login_required
@form(AddFriendSchema)
@jsonify_with(profile_serializer)
def add_friend(usernameOrEmail):
    friend = User.find(username=usernameOrEmail) or User.find(email=usernameOrEmail)
    if not friend or friend == current_user or not friend.confirmed:
        raise BadRequest("The user does not exist.")

    if current_user.is_friend(friend):
        raise Conflict("This user is already your friend.")

    friendship = Friendship(requesting_user=current_user, receiving_user=friend)
    friendship.save()

    return friend


@users_bp.route("/user/friends/<username>/", methods=["DELETE"])
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


@users_bp.route("/user/friends/<username>", methods=["PATCH"])
@login_required
@jsonify_with(profile_serializer)
def accept_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    friendship = Friendship.find(
        requesting_user=friend, receiving_user=current_user
    ) or Friendship.find(receiving_user=friend, requesting_user=current_user)
    if not friendship:
        raise BadRequest("This user is not in your friend list.")
    print(friend)
    friendship.pending = False
    friendship.save()
    return friend


@users_bp.route("/user/friends/")
@login_required
@query(GetFriendProvidersSchema)
@jsonify_with(profile_serializer, many=True)
def get_friends_providers(provides):
    friends = current_user.friends
    friends.append(current_user)
    if provides == "movies":
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

    return friends_available


@users_bp.route("/user/key/")
@fresh_login_required
def get_api_key():
    return {"key": current_user.api_key}


@users_bp.route("/user/key/", methods=["DELETE"])
@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    current_user.save()
    return {"message": "API key deleted"}


@users_bp.route("/user/key/", methods=["PUT"])
@fresh_login_required
@limiter.limit("3/hour")
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    current_user.save()
    return {"key": current_user.api_key}
