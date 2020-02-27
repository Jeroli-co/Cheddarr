from http import HTTPStatus
from time import time

from flask_login import current_user, login_required, login_user, logout_user

from server import db, InvalidUsage
from server.auth import auth
from server.auth.models import SigninForm, SignupForm, User
from server.config import SESSION_LIFETIME


@auth.route("/sign-up", methods=["POST"])
def signup():
    signup_form = SignupForm()
    if signup_form.validate():
        existing_user = (
            db.session.query(User.id).filter_by(email=signup_form.email.data).scalar()
        )
        if existing_user is None:
            user = User(
                username=signup_form.username.data,
                email=signup_form.email.data,
                password=signup_form.password.data,
                first_name=signup_form.firstName.data,
                last_name=signup_form.lastName.data,
            )
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return {"message": "User added"}, HTTPStatus.CREATED
        raise InvalidUsage("User already exists", status_code=HTTPStatus.CONFLICT)
    raise InvalidUsage("Error in signup form", status_code=HTTPStatus.INTERNAL_SERVER_ERROR, payload=signup_form.errors)


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if signin_form.validate():
        user = (
            User.query.filter_by(email=signin_form.usernameOrEmail.data).first()
            or User.query.filter_by(username=signin_form.usernameOrEmail.data).first()
        )
        if user:
            if user.check_password(signin_form.password.data):
                login_user(user)
                return {"username": user.username, "expiresAt": (time() + SESSION_LIFETIME) * 1000}, HTTPStatus.OK
        raise InvalidUsage("Wrong username/email or password", status_code=HTTPStatus.BAD_REQUEST)
    raise InvalidUsage("Error in signin form", status_code=HTTPStatus.INTERNAL_SERVER_ERROR, payload=signin_form.errors)


@auth.route("/sign-out", methods=["GET"])
@login_required
def signout():
    logout_user()
    return {"message": "User signed out"}, HTTPStatus.OK


@auth.route("/user/<user_name>", methods=["GET"])
@login_required
def user_profile():
    user = User.query.filter_by(username=current_user.username).first()
    if user:
        return {"username": user.username, "email": user.email, "firstName": user.first_name, "lastName": user.last_name}, HTTPStatus.OK
    return InvalidUsage("Internal error", status_code=HTTPStatus.INTERNAL_SERVER_ERROR)
