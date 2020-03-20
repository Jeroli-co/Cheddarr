from random import choice

from cloudinary.uploader import upload
from itsdangerous import URLSafeTimedSerializer, URLSafeSerializer
from flask import current_app as app
from sendgrid import Mail, From, To, Content
from werkzeug.utils import secure_filename

from server import mail
from cloudinary.api import resources


def send_email(to_email, subject, html_content):
    from_email = From(app.config.get("MAIL_DEFAULT_SENDER"))
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
    return random_picture["url"]


def upload_picture(filename):
    try:
        upload(secure_filename(filename), resource_type="image", folder="user_pictures")
    except Exception:
        raise Exception


def generate_token(data):
    serializer = URLSafeSerializer(app.secret_key)
    return serializer.dumps(data, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(app.secret_key)
    return serializer.dumps(data, salt=app.config.get("SECURITY_PASSWORD_SALT"))


def confirm_token(token, expiration=600):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        data = serializer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
    except Exception:
        raise Exception
    return data
