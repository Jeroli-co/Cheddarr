from flask import g
from flask_login import LoginManager, user_loaded_from_header

from server.exceptions import Unauthorized


def register_login_manager(app):
    from server.auth.models import User

    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.filter_by(session_token=user_id).first()

    @login_manager.unauthorized_handler
    def unauthorized():
        raise Unauthorized()

    @login_manager.needs_refresh_handler
    def refresh():
        raise Unauthorized(
            "Need to refresh session through web browser (API unavailable)"
        )

    @login_manager.request_loader
    def load_user_from_request(request):

        # try to login using the api_key url header
        api_key = request.headers.get("api_key")
        if api_key:
            user = User.query.filter_by(api_key=api_key).first()
            if user and user.confirmed:
                user_loaded_from_header.send(app, user=user)
                return user

        # return None if it did not login the user
        return None

    @user_loaded_from_header.connect
    def loaded_from_header(self, user=None):
        g.login_via_header = True


login_manager = LoginManager()
