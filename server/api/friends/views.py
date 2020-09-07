from flask_login import current_user, login_required
from server.api.auth.models import User
from server.api.auth.schemas import UserSchema
from server.extensions import ma
from server.extensions.marshmallow import form
from werkzeug.exceptions import BadRequest, Conflict, NotFound

profile_serializer = UserSchema(only=["username", "avatar", "email"])


@login_required
def get_friends(username=None):
    if username is not None:
        user = User.find(username=username)
        if not user or not current_user.is_friend(user):
            raise NotFound("The user does not exist.")

        return profile_serializer.jsonify(user)
    return profile_serializer.jsonify(current_user.get_friendships(), many=True)


@login_required
def get_received_friends():
    return profile_serializer.jsonify(current_user.get_pending_received(), many=True)


@login_required
def get_requested_friends():
    return profile_serializer.jsonify(current_user.get_pending_requested(), many=True)


@login_required
@form({"usernameOrEmail": ma.String(required=True)})
def add_friend(usernameOrEmail):
    print(usernameOrEmail)
    friend = User.find(username=usernameOrEmail) or User.find(email=usernameOrEmail)
    if not friend or friend == current_user:
        raise BadRequest("The user does not exist.")

    if current_user.is_friend(friend):
        raise Conflict("This user is already your friend.")

    current_user.add_friendship(friend)

    return profile_serializer.jsonify(friend)


@login_required
def remove_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    if not current_user.is_friend(friend):
        raise BadRequest("This user is not in your friend list.")

    current_user.remove_friendship(friend)
    return {"message": "Friend removed."}


@login_required
def accept_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    if not current_user.is_friend(friend):
        raise BadRequest("This user is not in your friend list.")

    current_user.confirm_friendship(friend)
    return profile_serializer.jsonify(friend)
