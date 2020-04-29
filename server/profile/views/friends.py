from http import HTTPStatus

from flask_login import current_user, login_required

from server.auth.models import User
from server.exceptions import HTTPError
from server.profile import profile
from server.profile.forms import UsernameOrEmailForm
from server.profile.serializers import profiles_serializer


@profile.route("/friends/<username>/", methods=["GET"])
@login_required
def get_friend(username):
    user = User.find(username=username)
    if not user or not current_user.is_friend(user):
        raise HTTPError("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    return profiles_serializer.jsonify(user), HTTPStatus.OK


@profile.route("/friends/", methods=["GET"])
@login_required
def get_friends():
    return (
        profiles_serializer.jsonify(current_user.get_friendships(), many=True),
        HTTPStatus.OK,
    )


@profile.route("/friends/received/", methods=["GET"])
@login_required
def get_received():
    return (
        profiles_serializer.jsonify(current_user.get_pending_received(), many=True),
        HTTPStatus.OK,
    )


@profile.route("/friends/requested/", methods=["GET"])
@login_required
def get_requested():
    return (
        profiles_serializer.jsonify(current_user.get_pending_requested(), many=True),
        HTTPStatus.OK,
    )


@profile.route("/friends/", methods=["POST"])
@login_required
def add_friend():
    add_friend_form = UsernameOrEmailForm()
    if not add_friend_form.validate():
        raise HTTPError(
            "Error while adding friend.",
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            payload=add_friend_form.errors,
        )

    friend = User.find(username=add_friend_form.usernameOrEmail.data) or User.find(
        email=add_friend_form.usernameOrEmail.data
    )
    if not friend or friend == current_user:
        raise HTTPError("The user does not exist.", status_code=HTTPStatus.BAD_REQUEST)

    if current_user.is_friend(friend):
        raise HTTPError(
            "This user is already your friend.", status_code=HTTPStatus.CONFLICT
        )
    current_user.add_friendship(friend)

    return profiles_serializer.jsonify(friend), HTTPStatus.CREATED


@profile.route("/friends/<username>/", methods=["DELETE"])
@login_required
def remove_friend(username):

    friend = User.find(username=username)
    if not friend:
        raise HTTPError("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    if not current_user.is_friend(friend):
        raise HTTPError(
            "This user is not in your friend list.", status_code=HTTPStatus.BAD_REQUEST
        )

    current_user.remove_friendship(friend)
    return {"message": "Friend removed."}, HTTPStatus.OK


@profile.route("/friends/<username>/accept/", methods=["GET"])
def accept_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise HTTPError("The user does not exist.", status_code=HTTPStatus.NOT_FOUND)

    if not current_user.is_friend(friend):
        raise HTTPError(
            "This user is not in your friend list.", status_code=HTTPStatus.BAD_REQUEST
        )

    current_user.confirm_friendship(friend)
    return profiles_serializer.jsonify(friend), HTTPStatus.OK
