from flask_login import login_required

from server import InvalidUsage
from server.auth import auth, User
from server.auth.serializers.user_serializer import UserSerializer


@login_required
@auth.route("/user/<username>")
def user_profile(username):
    user = User.find(username=username)
    if not user:
        raise InvalidUsage("The user does not exist", status_code=404)
    user_serializer = UserSerializer()
    return user_serializer.dumps(user)
