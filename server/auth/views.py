from flask import abort, request
from flask.helpers import url_for
from flask.json import jsonify
from flask_login import login_required, login_user
from werkzeug.utils import redirect

from server import db
from server.auth import auth
from server.auth.models import SignupForm, User


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
            return {"message": "User added"}, 201
        return {"message": "User already exist"}, 409
    return signup_form.errors, 500


@auth.route("/sign-in", methods=["POST"])
def signin():
    email = "test"
    existing_user = User.query.filter_by(email=email).first()
    if existing_user is None:
        user = User(username="test")
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return redirect(url_for("site.index"))
    return redirect(url_for("auth.signin"))


@auth.route("/profile", methods=["GET"])
@login_required
def user_profile():
    return redirect(url_for("site.favicon"))
