import subprocess

import click
from flask.cli import with_appcontext

from server.extensions import db
from server.extensions.db import db_drop_everything


@click.command("init-db")
@with_appcontext
def init_db():
    """Initialize the database."""
    db_drop_everything(db)
    db.create_all()
    click.echo("Initialized database.")


@click.command("celery")
@with_appcontext
def worker():
    """Start the celery worker."""
    subprocess.run("celery worker -A wsgi.celery -l debug", shell=True)
    click.echo("Celery worker started...")


@click.command("test")
def test():
    """Run the tests."""
    import pytest

    rv = pytest.main(["./server/tests", "--verbose"])
    exit(rv)
