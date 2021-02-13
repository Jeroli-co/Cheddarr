import os
import re
from os import listdir
from pathlib import Path
from random import choice
from urllib.parse import urlencode

import emails
from emails.template import JinjaTemplate
from jinja2 import Environment, FileSystemLoader

from server.core.config import config


def send_email(
    to_email: str,
    subject: str,
    html_template_name: str,
    environment: dict = None,
):
    assert config.MAIL_ENABLED, "Emails are disabled."
    environment = environment or {}
    for k, v in environment.items():
        environment[k] = re.sub(f"{config.API_PREFIX}/v[0-9]+", "", v)
    with open(Path(config.MAIL_TEMPLATES_FOLDER) / html_template_name) as f:
        template_str = f.read()
    message = emails.Message(
        mail_from=config.MAIL_DEFAULT_SENDER,
        subject=subject,
        html=JinjaTemplate(
            template_str,
            environment=Environment(loader=FileSystemLoader(config.MAIL_TEMPLATES_FOLDER)),
        ),
    )

    smtp_options = {
        "host": config.MAIL_SMTP_HOST,
        "port": config.MAIL_SMTP_PORT,
        "user": config.MAIL_SMTP_USER,
        "password": config.MAIL_SMTP_PASSWORD,
    }
    response = message.send(
        to=to_email,
        render=environment,
        smtp=smtp_options,
    )


def get_random_avatar():
    profile_images_path = os.path.join(config.IMAGES_FOLDER, "users")
    avatar = choice(listdir(profile_images_path))
    return f"{config.SERVER_HOST}/images/users/{avatar}"


def make_url(url: str, queries_dict: dict = None):
    queries_dict = queries_dict or {}
    parameters = urlencode(queries_dict)
    return url + "?" + parameters
