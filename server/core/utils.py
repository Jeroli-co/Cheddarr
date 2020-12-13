import os
from os import listdir
from pathlib import Path
from random import choice
from urllib.parse import urlencode

import emails
from emails.template import JinjaTemplate
from jinja2 import Environment, FileSystemLoader
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


def get_random_avatar():
    profile_images_path = os.path.join(settings.IMAGES_FOLDER, "users")
    avatar = choice(listdir(profile_images_path))
    return f"{settings.SERVER_HOST}/images/users/{avatar}"


def make_url(url: str, queries_dict: dict = None):
    queries_dict = queries_dict or {}
    parameters = urlencode(queries_dict)
    return url + "?" + parameters
