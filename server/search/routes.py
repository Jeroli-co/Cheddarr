from flask import request
from flask_login import current_user, login_required

from server.auth.models import User
from server.profile.serializers.profile_serializer import profiles_serializer
from server.search import search


@search.route("/friends/")
@login_required
def search_friends():
    username = request.args.get("username")
    result = []
    for user in User.query.filter(User.username.contains(username)).all():
        if user in current_user.friends_received or user in current_user.friends_sent:
            result.append(user)
    return profiles_serializer.jsonify(result, many=True)
