#!/usr/bin/env python
import os
import click

from server.core.commands import beat, init_db, run, test, worker


"""USAGE:
python manage.py [--env=production|development] COMMAND [OPTIONS] [ARGS]
"""


@click.group(
    help="""A utility script for the Cheddarr application.""",
)
@click.option(
    "--env",
    type=click.Choice(["development", "production"]),
    default="development",
    help="Whether to use DevConfig or ProdConfig (development by default).",
)
def cli(env):

    if env == "production":
        os.environ["ENV"] = "production"
    else:
        os.environ["ENV"] = "development"


cli.add_command(run)
cli.add_command(init_db)
cli.add_command(test)
cli.add_command(worker)
cli.add_command(beat)

if __name__ == "__main__":
    cli()
