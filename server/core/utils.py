import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import emails
import urllib.parse
from datetime import datetime, timedelta
from os import listdir
from random import choice

from emails.template import JinjaTemplate
from itsdangerous import URLSafeSerializer, URLSafeTimedSerializer
from jose import jwt
from pydantic import EmailStr

from server.core.config import settings


def send_email(
    to_email: EmailStr,
    subject: str,
    html_template_name: str,
    environment: dict = None,
):
    assert settings.MAIL_ENABLED, "Emails are disabled."
    environment = environment or {}
    for k, v in environment.items():
        environment[k] = v.replace(settings.API_PREFIX, "")
    with open(Path(settings.MAIL_TEMPLATES_FOLDER) / html_template_name) as f:
        template_str = f.read()
    message = emails.Message(
        mail_from=settings.MAIL_DEFAULT_SENDER,
        subject=subject,
        html=JinjaTemplate(
            template_str,
            environment=Environment(
                loader=FileSystemLoader(settings.MAIL_TEMPLATES_FOLDER)
            ),
        ),
    )

    smtp_options = {
        "host": settings.MAIL_SMTP_HOST,
        "port": settings.MAIL_SMTP_PORT,
        "user": settings.MAIL_SMTP_USER,
        "password": settings.MAIL_SMTP_PASSWORD,
    }
    response = message.send(
        to=to_email,
        render=environment,
        smtp=smtp_options,
    )


def create_jwt_access_token(payload, expires_delta: timedelta = None) -> str:
    to_encode = payload.dict()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.SIGNING_ALGORITHM
    )
    return encoded_jwt


def generate_token(data):
    serializer = URLSafeSerializer(settings.SECRET_KEY)
    return serializer.dumps(data)


def confirm_token(data):
    serializer = URLSafeSerializer(settings.SECRET_KEY)
    return serializer.loads(data)


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    return serializer.dumps(data)


def confirm_timed_token(token: str, expiration_minutes: int = 30):
    serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
    try:
        data = serializer.loads(token, max_age=expiration_minutes * 60)
    except Exception:
        raise Exception
    return data


def random_avatar():
    profile_images_path = os.path.join(settings.IMAGES_FOLDER, "users")
    avatar = choice(listdir(profile_images_path))
    return f"{settings.SERVER_HOST}/images/users/{avatar}"


def make_url(url: str, queries_dict: dict = None):
    queries_dict = queries_dict or {}
    parameters = urllib.parse.urlencode(queries_dict)
    return url + "?" + parameters
