from server.helpers import url

from . import friends, views

url(friends, views.get_friends, ["/", "/<username>/"], methods=["GET"])
url(friends, views.add_friend, ["/"], methods=["POST"])
url(friends, views.accept_friend, ["/<username>/"], methods=["PATCH"])
url(friends, views.remove_friend, ["/<username>/"], methods=["DELETE"])
url(friends, views.get_received_friends, ["/received/"], methods=["GET"])
url(friends, views.get_requested_friends, ["/requested/"], methods=["GET"])
