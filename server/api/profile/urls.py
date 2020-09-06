# Profile management
from server.helpers import url
from . import profile

url(profile, "get_profile", ["/"], methods=["GET"])
url(profile, "delete_user", ["/"], methods=["DELETE"])
url(profile, "change_password", ["/password/"], methods=["PUT"])
url(
    profile,
    "reset_password",
    ["/password/reset/", "/password/reset/<token>/"],
    methods=["GET", "POST"],
)
url(profile, "change_username", ["/username/"], methods=["PUT"])
url(profile, "change_email", ["/email/"], methods=["PUT"])


# Friends management
url(profile, "get_friends", ["/friends/", "/friends/<username>/"], methods=["GET"])
url(profile, "get_received_friends", ["/friends/received/"], methods=["GET"])
url(profile, "get_requested_friends", ["/friends/requested/"], methods=["GET"])
url(profile, "add_friend", ["/friends/"], methods=["POST"])
url(profile, "accept_friend", ["/friends/<username>/"], methods=["PATCH"])
url(profile, "remove_friend", ["/friends/<username>/"], methods=["DELETE"])
