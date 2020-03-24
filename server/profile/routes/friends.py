from http import HTTPStatus

from flask_login import login_required, current_user

from server import InvalidUsage
from server.auth import auth
from server.auth.models import User
from server.profile import profile
from server.profile.forms import UsernameForm
from server.profile.serializers.user_serializer import user_serializer, users_serializer


@auth.route("/users/<username>", methods=["GET"])
@login_required
def public_profile(username):
    user = User.find(username=username)
    if not user:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    # TODO: add a boolean field (is_friend) if username is contain in the current user friend list

    return user_serializer.dump(user), HTTPStatus.OK


@profile.route("/friends", methods=["GET"])
@login_required
def get_all_friends():
    friends = current_user.friends.all()
    return users_serializer.dumps(friends)


@profile.route("/friends", methods=["POST"])
@login_required
def add_friend():
    friend_username = UsernameForm()
    if not friend_username.validate():
        raise InvalidUsage(
            "Error while adding friend.", status_code=HTTPStatus.INTERNAL_SERVER_ERROR
        )

    friend = User.find(username=friend_username.username.data)
    if not friend:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)
    current_user.add_friend(friend)
    return {"message": "Friend added."}, HTTPStatus.OK


@profile.route("/friends/<username>", methods=["DELETE"])
@login_required
def delete_friend(username):

    friend = User.find(username=username)
    if not friend:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)
    current_user.remove_friend(friend)

    return {"message": "Friend removed."}, HTTPStatus.OK
