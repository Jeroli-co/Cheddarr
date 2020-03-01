from time import time

from flask_login import confirm_login, current_user
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from flask import current_app as app
from server import mail
from server.config import SESSION_LIFETIME


def get_session_info():
    confirm_login()
    return {"username": current_user.username, "expiresAt": (int(time()) + SESSION_LIFETIME * 60) * 1000} #Session next timeout in ms


def send_email(to, subject, template):
    msg = Message(
        subject,
        recipients=[to],
        html=template,
    )
    mail.send(msg)


def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.secret_key)
    return serializer.dumps(email, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        raise Exception
    return email
