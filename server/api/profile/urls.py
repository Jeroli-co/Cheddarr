from server.helpers import url

from . import profile, views

url(profile, views.get_profile, ["/"], methods=["GET"])
url(profile, views.delete_user, ["/"], methods=["DELETE"])
url(profile, views.change_password, ["/password/"], methods=["PUT"])
url(
    profile,
    views.reset_password,
    ["/password/reset/", "/password/reset/<token>/"],
    methods=["GET", "POST"],
)
url(profile, views.change_username, ["/username/"], methods=["PUT"])
url(profile, views.change_email, ["/email/"], methods=["PUT"])
