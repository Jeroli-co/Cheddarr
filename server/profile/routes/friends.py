from http import HTTPStatus

from flask_login import login_required, current_user

from server import InvalidUsage
from server.auth.models import User
from server.profile import profile
from server.profile.forms import UsernameOrEmailForm
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
def get_friends():

    return (
        {
            "requested": users_serializer.dump(current_user.get_pending_requested()),
            "received": users_serializer.dump(current_user.get_pending_received()),
            "friends": users_serializer.dump(current_user.get_friendships()),
        },
        HTTPStatus.OK,
    )


@profile.route("/friends/", methods=["POST"])
@login_required
def add_friend():
    add_friend_form = UsernameOrEmailForm()
    if not add_friend_form.validate():
        raise InvalidUsage(
            "Error while adding friend.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=add_friend_form.errors,
        )

    friend = User.find(username=add_friend_form.usernameOrEmail.data) or User.find(
        email=add_friend_form.usernameOrEmail.data
    )
    if not friend or friend == current_user:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    if current_user.is_friend(friend):
        raise InvalidUsage(
            "This user is already your friend.", status_code=HTTPStatus.CONFLICT
        )
    current_user.add_friendship(friend)

    return user_serializer.dump(friend), HTTPStatus.CREATED


@profile.route("/friends/<username>/", methods=["DELETE"])
@login_required
def remove_friend(username):

    friend = User.find(username=username)
    if not friend:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    if not current_user.is_friend(friend):
        raise InvalidUsage(
            "This user is not in your friend list.", status_code=HTTPStatus.BAD_REQUEST
        )

    current_user.remove_friendship(friend)
    return {"message": "Friend removed."}, HTTPStatus.OK


@profile.route("/friends/<username>/accept/", methods=["GET"])
def accept_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise InvalidUsage("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    if not current_user.is_friend(friend):
        raise InvalidUsage(
            "This user is not in your friend list.", status_code=HTTPStatus.BAD_REQUEST
        )

    current_user.confirm_friendship(friend)
    return user_serializer.dump(friend), HTTPStatus.OK
