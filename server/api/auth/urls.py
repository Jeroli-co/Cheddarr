from server.helpers import url

from . import auth

# Sign-up
url(auth, "signup", ["/sign-up/"], methods=["POST"])
url(auth, "confirm_email", ["/sign-up/confirm/<token>/"], methods=["GET"])
url(auth, "resend_confirmation", ["/sign-up/resend/"], methods=["POST"])

# Sign-in
url(auth, "signin", ["/sign-in/"], methods=["POST"])
url(auth, "start_signin_plex", ["/sign-in/plex/"], methods=["GET"])
url(auth, "authorize_signin_plex", ["/sign-in/plex/authorize/"], methods=["POST"])
url(auth, "confirm_signin_plex", ["/sign-in/plex/confirm/"], methods=["GET"])

# Sign-out
url(auth, "signout", ["/sign-out/"], methods=["GET"])

# Api Key
url(auth, "get_api_key", ["/key/"], methods=["GET"])
url(auth, "delete_api_key", ["/key/"], methods=["DELETE"])
url(auth, "reset_api_key", ["/key/"], methods=["PUT"])
