from flask_login import login_required, logout_user

from server.auth.routes import auth


@auth.route("/sign-out/", methods=["GET"])
@login_required
def signout():
    logout_user()
    return {"message": "User signed out"}
