from http import HTTPStatus

from flask_login import login_required

from server import InvalidUsage
from server.auth import auth
from server.auth.models import User
from server.profile import profile
from server.profile.serializers.user_serializer import UserSerializer

user_serializer = UserSerializer()


@auth.route("/users/<username>", methods=["GET"])
@login_required
def public_profile(username):
    user = User.find(username=username)
    if not user:
        raise InvalidUsage("The user does not exist.", status_code=404)

    # TODO: add a boolean field (is_friend) if username is contain in the current user friend list

    return user_serializer.dump(user), HTTPStatus.OK


@profile.route("/friends", methods=["GET"])
@login_required
def get_all_friends():

    return {}


@profile.route("/friends", methods=["POST"])
@login_required
def add_friend():

    return {}


@profile.route("/friends/<username>", methods=["DELETE"])
@login_required
def delete_friend():

    return {}
