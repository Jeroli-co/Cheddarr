#!/usr/bin/env python
from pathlib import Path

import click

"""USAGE:
python cheddarr.py [OPTIONS] COMMAND
"""


@click.group(
    help="""A utility script for the Cheddarr application""",
)
@click.option(
    "--debug",
    "-d",
    default=False,
    is_flag=True,
)
@click.pass_context
def cli(ctx, debug):
    ctx.obj["DEBUG"] = debug


@cli.command("init-db")
def init_db():
    """Initialize the database."""
    from server.database.init_db import init_db

    init_db()
    click.echo("Database initialized.")


@cli.command("test")
def test():
    """Run the tests."""
    import pytest

    rv = pytest.main(["./server/tests", "--verbose"])
    exit(rv)


@cli.command("run")
@click.pass_context
def run(ctx):
    import uvicorn

    debug = ctx.obj["DEBUG"]
    if not debug:
        from alembic.command import upgrade
        from alembic.config import Config

        upgrade(Config(Path.cwd() / "server/alembic.ini"), "head")
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=9090,
        reload=debug,
        debug=debug,
        access_log=debug,
    )


if __name__ == "__main__":
    cli(obj={})
