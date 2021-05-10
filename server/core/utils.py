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
    email_options: dict,
    to_email: str,
    subject: str,
    html_template_name: str,
    environment: dict = None,
):
    environment = environment or {}
    for k, v in environment.items():
        environment[k] = re.sub(f"{config.api_prefix}/v[0-9]+", "", v)
    with open(Path(config.mail_templates_folder) / html_template_name) as f:
        template_str = f.read()
    message = emails.Message(
        mail_from=(email_options["sender_name"], email_options["sender_address"]),
        subject=subject,
        html=JinjaTemplate(
            template_str,
            environment=Environment(loader=FileSystemLoader(config.mail_templates_folder)),
        ),
    )

    smtp_options = {
        "host": email_options["smtp_host"],
        "port": email_options["smtp_port"],
        "user": email_options["smtp_user"],
        "password": email_options["smtp_password"],
        "ssl": email_options["ssl"],
    }
    message.send(
        to=to_email,
        render=environment,
        smtp=smtp_options,
    )


def get_random_avatar():
    profile_images_path = os.path.join(config.images_folder, "users")
    avatar = choice(listdir(profile_images_path))
    return f"{config.server_host}/images/users/{avatar}"


def make_url(url: str, queries_dict: dict = None):
    queries_dict = queries_dict or {}
    parameters = urlencode(queries_dict)
    return url + "?" + parameters
