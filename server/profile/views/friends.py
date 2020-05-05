from flask_login import current_user, login_required

from server.auth.models import User
from server.exceptions import BadRequest, Conflict, InternalServerError, NotFound
from server.profile import profile
from server.profile.forms import UsernameOrEmailForm
from server.profile.serializers import profiles_serializer


@profile.route("/friends/<username>/", methods=["GET"])
@login_required
def get_friend(username):
    user = User.find(username=username)
    if not user or not current_user.is_friend(user):
        raise NotFound("The user does not exist.")

    return profiles_serializer.jsonify(user)


@profile.route("/friends/", methods=["GET"])
@login_required
def get_friends():
    return profiles_serializer.jsonify(current_user.get_friendships(), many=True)


@profile.route("/friends/received/", methods=["GET"])
@login_required
def get_received():
    return profiles_serializer.jsonify(current_user.get_pending_received(), many=True)


@profile.route("/friends/requested/", methods=["GET"])
@login_required
def get_requested():
    return profiles_serializer.jsonify(current_user.get_pending_requested(), many=True)


@profile.route("/friends/", methods=["POST"])
@login_required
def add_friend():
    add_friend_form = UsernameOrEmailForm()
    if not add_friend_form.validate():
        raise InternalServerError(
            "Error while adding friend.", payload=add_friend_form.errors,
        )

    friend = User.find(username=add_friend_form.usernameOrEmail.data) or User.find(
        email=add_friend_form.usernameOrEmail.data
    )
    if not friend or friend == current_user:
        raise BadRequest("The user does not exist.")

    if current_user.is_friend(friend):
        raise Conflict("This user is already your friend.")

    current_user.add_friendship(friend)

    return profiles_serializer.jsonify(friend)


@profile.route("/friends/<username>/", methods=["DELETE"])
@login_required
def remove_friend(username):

    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    if not current_user.is_friend(friend):
        raise BadRequest("This user is not in your friend list.")

    current_user.remove_friendship(friend)
    return {"message": "Friend removed."}


@profile.route("/friends/<username>/accept/", methods=["GET"])
def accept_friend(username):
    friend = User.find(username=username)
    if not friend:
        raise NotFound("The user does not exist.")

    if not current_user.is_friend(friend):
        raise BadRequest("This user is not in your friend list.")

    current_user.confirm_friendship(friend)
    return profiles_serializer.jsonify(friend)
