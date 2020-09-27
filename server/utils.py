import os
import secrets
import urllib.parse
from os import listdir
from random import choice

from flask import current_app as app, url_for
from itsdangerous import Signer, URLSafeSerializer, URLSafeTimedSerializer

from server.config import IMAGES_FOLDER


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


def random_avatar():
    profile_images_path = os.path.join(IMAGES_FOLDER, "user")
    avatar = choice(listdir(profile_images_path))
    return url_for("site.images", image_name="user/" + avatar, _external=True)


def make_url(url, queries_dict=None):
    queries_dict = queries_dict or {}
    parameters = urllib.parse.urlencode(queries_dict)
    return url + "?" + parameters
