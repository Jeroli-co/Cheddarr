#!/usr/bin/env python
import asyncclick as click

from server.core.logger import LOGGING_CONFIG

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
async def init_db():
    """Initialize the database."""
    from server.database.init_db import init_db

    await init_db()
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
    log_level = "debug" if debug else "error"
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=9090,
        reload=debug,
        debug=debug,
        log_level=log_level,
        log_config=LOGGING_CONFIG,
    )


if __name__ == "__main__":
    cli(obj={})
