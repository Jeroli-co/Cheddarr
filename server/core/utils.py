import re
from os import listdir
from pathlib import Path
from random import choice
from typing import Any
from urllib.parse import urlencode

import emails
from emails.template import JinjaTemplate
from jinja2 import Environment, FileSystemLoader

from server.core.config import get_config


def send_email(
    email_settings: dict[str, Any],
    to_email: str,
    subject: str,
    html_template_name: str,
    environment: dict[str, Any] | None = None,
) -> None:
    environment = environment or {}
    for k, v in environment.items():
        environment[k] = re.sub("/api/v[0-9]+", "", v)
    with Path(get_config().mail_templates_folder / html_template_name).open() as f:
        template_str = f.read()
    message = emails.Message(
        mail_from=(email_settings["sender_name"], email_settings["sender_address"]),
        subject=subject,
        html=JinjaTemplate(
            template_str,
            environment=Environment(loader=FileSystemLoader(get_config().mail_templates_folder)),
        ),
    )

    smtp_options = {
        "host": email_settings["smtp_host"],
        "port": email_settings["smtp_port"],
        "user": email_settings["smtp_user"],
        "password": email_settings["smtp_password"],
        "ssl": email_settings["ssl"],
    }

    message.send(
        to=to_email,
        render=environment,
        smtp=smtp_options,
    )


def get_random_avatar() -> str:
    profile_images_path = get_config().images_folder / "users"
    avatar = choice(listdir(profile_images_path))
    return f"/images/users/{avatar}"


def make_url(url: str, queries_dict: dict[str, Any] | None = None) -> str:
    queries_dict = queries_dict or {}
    parameters = urlencode(queries_dict)
    return url + "?" + parameters


def camel_to_snake_case(name: str) -> str:
    """Convert a ``CamelCase`` name to ``snake_case``."""
    name = re.sub(r"((?<=[a-z0-9])[A-Z]|(?!^)[A-Z](?=[a-z]))", r"_\1", name)
    return name.lower().lstrip("_")
