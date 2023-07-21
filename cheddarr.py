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
async def cli(ctx: Context, debug: bool) -> None:
    ctx.obj["DEBUG"] = debug


@cli.command("init-db")
async def init_db() -> None:
    """Initialize the database."""
    from server.database.init_db import init_db

    await init_db()
    click.echo("Database initialized.")


@cli.command("test")
async def test() -> None:
    """Run the tests."""
    import pytest

    await sync_to_async(pytest.main)(["./server/tests", "--verbose"])


@cli.command("run")
@click.pass_context
async def run(ctx: Context) -> None:
    """Run the application."""
    import uvicorn

    from server.core.config import get_config

    app_config = get_config()
    app_config.setup()

    debug = ctx.obj["DEBUG"]
    if not debug:
        from asyncio import subprocess

        await subprocess.create_subprocess_exec("alembic", "upgrade", "head", cwd=str(Path.cwd() / "server/database"))

    server_config = uvicorn.Config(
        app="server.main:app",
        host="0.0.0.0",
        port=get_config().server_port,
        reload=debug,
        access_log=debug,
    )

    await uvicorn.Server(server_config).serve()


if __name__ == "__main__":
    cli(obj={})
