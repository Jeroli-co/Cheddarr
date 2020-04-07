import secrets
from random import choice

from cloudinary.api import resources
from cloudinary.uploader import upload
from flask import current_app as app
from itsdangerous import Signer, URLSafeSerializer, URLSafeTimedSerializer


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


def upload_picture(file):
    try:
        r = upload(file, resource_type="image", folder="user_pictures")
        return r["secure_url"]
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
