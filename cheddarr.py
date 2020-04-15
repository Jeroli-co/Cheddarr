#!/usr/bin/env python
import argparse
import os
import sys

import click
from flask.cli import cli, FlaskGroup, run_command

from server.app import create_app

"""USAGE:
python manage.py [--env=production|development] COMMAND [OPTIONS] [ARGS]
"""


@click.group(
    cls=FlaskGroup,
    add_default_commands=False,
    create_app=lambda _: create_app(),
    help="""\
A utility script for the Cheddarr application.
""",
)
@click.option(
    "--env",
    type=click.Choice(["development", "production"]),
    default="production",
    help="Whether to use DevConfig or ProdConfig (production by default).",
)
@click.pass_context
def cli(ctx, env):
    ctx.obj.data["env"] = env


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--env", default="production")
    args, _ = parser.parse_known_args()

    if args.env == "development":
        os.environ["FLASK_ENV"] = "development"
    else:
        os.environ["FLASK_ENV"] = "production"

    cli.add_command(run_command)
    cli.main(args=sys.argv[1:])


if __name__ == "__main__":
    main()
