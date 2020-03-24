import os

from flask_login import fresh_login_required, current_user, login_required

from server import db, utils
from server.auth import auth


@auth.route("/key")
@login_required
def get_api_key():
    return utils.generate_token(current_user.api_key)


@auth.route("/key/reset")
@login_required
def reset_api_key():
    current_user.api_key = os.urandom(12).hex()
    db.session.commit()
    return utils.generate_token(current_user.api_key)
