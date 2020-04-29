from flask_login import current_user, fresh_login_required

from server import utils
from server.auth import auth
from server.extensions import db, limiter


@auth.route("/key/cheddarr/", methods=["GET"])
@fresh_login_required
def get_api_key():
    return {"key": current_user.api_key}


@auth.route("/key/cheddarr/", methods=["DELETE"])
@fresh_login_required
def delete_api_key():
    current_user.api_key = None
    db.session.commit()
    return {"message": "API key deleted"}


@auth.route("/key/cheddarr/reset/", methods=["GET"])
@limiter.limit("3/hour")
@fresh_login_required
def reset_api_key():
    current_user.api_key = utils.generate_api_key()
    db.session.commit()
    return {"key": current_user.api_key}