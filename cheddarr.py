#!/usr/bin/env python
from pathlib import Path

import asyncclick as click
from asgiref.sync import sync_to_async
from asyncclick import Context

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
def cli(ctx: Context, debug: bool) -> None:
    ctx.obj["DEBUG"] = debug


@cli.command("init-db")
@click.pass_context
async def init_db(ctx: Context) -> None:
    """Initialize the database."""
    debug = ctx.obj["DEBUG"]
    from server.database.init_db import init_db

    await init_db(debug)
    click.echo("Database initialized.")


@cli.command("test")
async def test() -> None:
    """Run the tests."""
    import pytest

    await sync_to_async(pytest.main)(["./server/tests", "--verbose"])


@cli.command("run")
@click.pass_context
def run(ctx: Context) -> None:
    """Run the application."""
    import uvicorn

    from server.core.config import get_config

    debug = ctx.obj["DEBUG"]
    if not debug:
        from alembic.command import upgrade
        from alembic.config import Config

        upgrade(Config(str(Path.cwd() / "server/alembic.ini")), "head")

    uvicorn.run(
        "server.main:app",
        host=get_config().server_domain,
        port=get_config().server_port,
        reload=debug,
        access_log=debug,
    )


if __name__ == "__main__":
    cli(obj={})
