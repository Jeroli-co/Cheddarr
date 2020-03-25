from http import HTTPStatus

from flask_login import login_required, current_user

from server import InvalidUsage
from server.auth.models import User
from server.profile import profile
from server.profile.forms import UsernameForm
from server.profile.serializers.user_serializer import user_serializer, users_serializer


@profile.route("/friends/<username>/", methods=["GET"])
@login_required
def get_friend(username):
    user = User.find(username=username)
    if not user or not current_user.is_friend(user):
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    return user_serializer.dump(user), HTTPStatus.OK


@profile.route("/friends/", methods=["GET"])
@login_required
def get_all_friends():
    return "[]"


@profile.route("/friends/", methods=["POST"])
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


@profile.route("/friends/<username>/", methods=["DELETE"])
@login_required
def delete_friend(username):

    friend = User.find(username=username)
    if not friend:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)
    current_user.remove_friend(friend)

    return {"message": "Friend removed."}, HTTPStatus.OK
