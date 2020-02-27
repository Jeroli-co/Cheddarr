from http import HTTPStatus

from flask.helpers import url_for
from flask_login import current_user, login_required, login_user, logout_user
from werkzeug.utils import redirect

from server import db
from server.auth import auth
from server.auth.models import SigninForm, SignupForm, User


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
        return {"message": "User already exist"}, HTTPStatus.CONFLICT
    return signup_form.errors, HTTPStatus.INTERNAL_SERVER_ERROR


@auth.route("/sign-in", methods=["POST"])
def signin():
    signin_form = SigninForm()
    if signin_form.validate():
        user = (
            User.query.filter_by(email=signin_form.login.data).first()
            or User.query.filter_by(username=signin_form.login.data).first()
        )
        if user:
            if user.check_password(signin_form.password.data):
                login_user(user)
                return redirect(url_for("site.index"))
        return {"message": "Wrong username or password"}, HTTPStatus.BAD_REQUEST
    return redirect(url_for("auth.signin"))


@auth.route("/sign-out", methods=["GET"])
@login_required
def signout():
    logout_user()
    return redirect(url_for("site.index"))


@auth.route("/profile", methods=["GET"])
@login_required
def user_profile():
    print(current_user)
    return redirect(url_for("site.favicon"))
