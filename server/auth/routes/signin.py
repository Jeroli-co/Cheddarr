from http import HTTPStatus
from flask import request
from flask_login import login_user, current_user
from server import InvalidUsage
from server.auth import auth
from server.auth.models import User
from server.auth.forms import SigninForm
from server.auth.serializers.session_serializer import SessionSerializer

session_serializer = SessionSerializer()


@auth.route("/sign-in/", methods=["GET", "POST"])
def signin():
    if request.method == "GET":
        if current_user.is_authenticated:
            return session_serializer.dump(current_user), HTTPStatus.OK
        else:
            raise InvalidUsage(
                "User not authenticated", status_code=HTTPStatus.UNAUTHORIZED
            )

    else:
        signin_form = SigninForm()
        if not signin_form.validate():
            raise InvalidUsage(
                "Error while signing in.",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                payload=signin_form.errors,
            )

        user = User.find(email=signin_form.usernameOrEmail.data) or User.find(
            username=signin_form.usernameOrEmail.data
        )
        if not user or not user.check_password(signin_form.password.data):
            raise InvalidUsage(
                "Wrong username/email or password.", status_code=HTTPStatus.BAD_REQUEST
            )

        if not user.confirmed:
            raise InvalidUsage(
                "The email needs to be confirmed.", status_code=HTTPStatus.UNAUTHORIZED,
            )

        remember = signin_form.remember.data if signin_form.remember else False
        login_user(user, remember=remember)
        return session_serializer.dump(user), HTTPStatus.OK
