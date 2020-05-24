from . import auth
from server.helpers import url

# Sign-up
url(auth, "signup", ["/sign-up/"], methods=["POST"])
url(auth, "confirm_email", ["/sign-up/confirm/<token>/"], methods=["GET"])
url(auth, "resend_confirmation", ["/sign-up/resend/"], methods=["POST"])

# Sign-in
url(auth, "signin", ["/sign-in/"], methods=["POST"])
url(auth, "signin_plex", ["/sign-in/plex/"], methods=["GET"])
url(auth, "authorize_plex", ["/sign-in/plex/authorize/"], methods=["GET"])

# Sign-out
url(auth, "signout", ["/sign-out/"], methods=["GET"])

# Api Key
url(auth, "get_api_key", ["/key/"], methods=["GET"])
url(auth, "delete_api_key", ["/key/"], methods=["DELETE"])
url(auth, "reset_api_key", ["/key/"], methods=["PUT"])
