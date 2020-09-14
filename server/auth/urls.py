from flask import Blueprint
from server.helpers import url
from . import views

auth_bp = Blueprint("auth", __name__)

# Sign-up
url(auth_bp, views.signup, ["/sign-up/"], methods=["POST"])
url(auth_bp, views.confirm_email, ["/sign-up/confirm/<token>/"], methods=["GET"])
url(auth_bp, views.resend_confirmation, ["/sign-up/resend/"], methods=["POST"])

# Sign-in
url(auth_bp, views.signin, ["/sign-in/"], methods=["POST"])
url(auth_bp, views.start_signin_plex, ["/sign-in/plex/"], methods=["GET"])
url(
    auth_bp, views.authorize_signin_plex, ["/sign-in/plex/authorize/"], methods=["POST"]
)
url(auth_bp, views.confirm_signin_plex, ["/sign-in/plex/confirm/"], methods=["GET"])

# Sign-out
url(auth_bp, views.signout, ["/sign-out/"], methods=["GET"])
