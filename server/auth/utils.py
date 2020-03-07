from time import time

from flask_login import confirm_login, current_user
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, URLSafeSerializer
from flask import current_app as app
from server import mail
from server.auth import User
from server.config import SESSION_LIFETIME


def create_user(first_name, last_name, email, username, password=None):
    user = User(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        confirmed=False if password is not None else True
    )
    if user.password:
        user.session_token = generate_token([user.email, user.password])
    else:
        user.session_token = generate_token([user.email])
    return user


def get_session_info():
    confirm_login()
    return {
            "username": current_user.username,
            "expiresAt": (int(time()) + SESSION_LIFETIME * 60) * 1000
        }  # Session next timeout in ms


def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
    )
    mail.send(msg)


def generate_token(data):
    serializer = URLSafeSerializer(app.secret_key)
    return serializer.dumps(data, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(app.secret_key)
    return serializer.dumps(data, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def confirm_token(token, expiration=600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        data = serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        raise Exception
    return data

