import secrets
import string

from random import choice

from cloudinary.uploader import upload
from itsdangerous import URLSafeTimedSerializer, URLSafeSerializer, Signer
from flask import current_app as app
from sendgrid import Mail, From, To, Content

from server import mail
from cloudinary.api import resources


def send_email(to_email, subject, html_content):
    from_email = From(*app.config.get("MAIL_DEFAULT_SENDER"))
    message = Mail(
        from_email=from_email,
        to_emails=To(to_email),
        subject=subject,
        html_content=Content("text/html", html_content),
    )
    try:
        mail.send(message)
    except Exception:
        raise Exception


def random_user_picture():
    try:
        pictures = resources(resource_type="image", type="upload", prefix="default/")[
            "resources"
        ]
    except Exception:
        raise Exception
    random_picture = choice(pictures)
    return random_picture["secure_url"]


def upload_picture(file):
    try:
        return upload(file, resource_type="image", folder="user_pictures")
    except Exception:
        raise Exception


def sign(value):
    s = Signer(app.secret_key, salt=app.config.get("SECURITY_PASSWORD_SALT"))
    return s.sign(value)


def unsign(value):
    s = Signer(app.secret_key, salt=app.config.get("SECURITY_PASSWORD_SALT"))
    return s.unsign(value)


def generate_api_key():
    return secrets.token_hex(24)


def generate_token(data):
    serializer = URLSafeSerializer(
        app.secret_key, salt=app.config.get("SECURITY_PASSWORD_SALT")
    )
    return serializer.dumps(data)


def confirm_token(data):
    serializer = URLSafeSerializer(
        app.secret_key, salt=app.config.get("SECURITY_PASSWORD_SALT")
    )
    return serializer.loads(data)


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(
        app.secret_key, salt=app.config.get("SECURITY_PASSWORD_SALT")
    )
    return serializer.dumps(data)


def confirm_timed_token(token, expiration=600):
    serializer = URLSafeTimedSerializer(
        app.secret_key, salt=app.config["SECURITY_PASSWORD_SALT"]
    )
    try:
        data = serializer.loads(token, max_age=expiration)
    except Exception:
        raise Exception
    return data
