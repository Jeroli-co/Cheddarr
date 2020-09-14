from flask import Blueprint
from server.helpers import url

from . import views

users_bp = Blueprint("users", __name__)

# User management
url(
    users_bp,
    views.get_user,
    ["/user", "/users/<int:id>", "/users/<username>"],
    methods=["GET"],
)
url(users_bp, views.delete_user, ["/user/"], methods=["DELETE"])
url(users_bp, views.change_password, ["/user/password/"], methods=["PUT"])
url(
    users_bp,
    views.reset_password,
    ["/user/password/reset/", "/user/password/reset/<token>/"],
    methods=["GET", "POST"],
)

url(users_bp, views.update_user, ["/user/"], methods=["PATCH"])

# Api Key
url(users_bp, views.get_api_key, ["/user/key/"], methods=["GET"])
url(users_bp, views.delete_api_key, ["/user/key/"], methods=["DELETE"])
url(users_bp, views.reset_api_key, ["/user/key/"], methods=["PUT"])

# Friends management
url(users_bp, views.get_friends, ["/user/friends/"], methods=["GET"])
url(users_bp, views.add_friend, ["/user/friends/"], methods=["POST"])
url(users_bp, views.accept_friend, ["/user/friends/<username>/"], methods=["PATCH"])
url(users_bp, views.remove_friend, ["/user/friends/<username>/"], methods=["DELETE"])
url(users_bp, views.get_received_friends, ["/user/friends/received/"], methods=["GET"])
url(
    users_bp, views.get_requested_friends, ["/user/friends/requested/"], methods=["GET"]
)
