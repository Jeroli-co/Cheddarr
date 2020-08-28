import secrets
from os import listdir
from random import choice
from flask import current_app as app
from itsdangerous import Signer, URLSafeSerializer, URLSafeTimedSerializer

from server.config import REACT_STATIC_FOLDER


def sign(value):
    s = Signer(app.secret_key)
    return s.sign(value)


def unsign(value):
    s = Signer(app.secret_key)
    return s.unsign(value)


def generate_api_key():
    return secrets.token_hex(24)


def generate_token(data):
    serializer = URLSafeSerializer(app.secret_key)
    return serializer.dumps(data)


def confirm_token(data):
    serializer = URLSafeSerializer(app.secret_key)
    return serializer.loads(data)


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(app.secret_key)
    return serializer.dumps(data)


def confirm_timed_token(token, expiration=600):
    serializer = URLSafeTimedSerializer(app.secret_key)
    try:
        data = serializer.loads(token, max_age=expiration)
    except Exception:
        raise Exception
    return data

