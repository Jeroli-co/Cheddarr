from server.helpers import url

from . import auth, views

# Sign-up
url(auth, views.signup, ["/sign-up/"], methods=["POST"])
url(auth, views.confirm_email, ["/sign-up/confirm/<token>/"], methods=["GET"])
url(auth, views.resend_confirmation, ["/sign-up/resend/"], methods=["POST"])

# Sign-in
url(auth, views.signin, ["/sign-in/"], methods=["POST"])
url(auth, views.start_signin_plex, ["/sign-in/plex/"], methods=["GET"])
url(auth, views.authorize_signin_plex, ["/sign-in/plex/authorize/"], methods=["POST"])
url(auth, views.confirm_signin_plex, ["/sign-in/plex/confirm/"], methods=["GET"])

# Sign-out
url(auth, views.signout, ["/sign-out/"], methods=["GET"])

# Api Key
url(auth, views.get_api_key, ["/key/"], methods=["GET"])
url(auth, views.delete_api_key, ["/key/"], methods=["DELETE"])
url(auth, views.reset_api_key, ["/key/"], methods=["PUT"])
