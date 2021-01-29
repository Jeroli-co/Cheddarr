import subprocess

import click


@click.command("init-db")
def init_db():
    """Initialize the database."""
    from server.database.base import init_db

    init_db()
    click.echo("Database initialized.")


@click.command("test")
def test():
    """Run the tests."""
    import pytest

    rv = pytest.main(["./server/tests", "--verbose"])
    exit(rv)


@click.command("run")
def run():
    import os
    import uvicorn

    debug = os.environ.get("ENV") == "development"
    uvicorn.run("server.main:app", reload=debug, debug=debug)


@click.command("worker")
def worker():
    """Start the celery worker."""
    subprocess.run(
        "celery -A server.core.celery_app worker -l INFO -P solo", shell=True
    )
    click.echo("Celery worker started...")


@click.command("beat")
def beat():
    """Start the celery worker."""
    subprocess.run("celery -A server.core.celery_app beat -l INFO", shell=True)
    click.echo("Celery worker started...")
