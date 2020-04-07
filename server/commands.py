import subprocess

import click
from flask.cli import with_appcontext

from server.extensions import db


@click.command("init-db")
@with_appcontext
def init_db():
    """Initialize the database."""
    db.drop_all()
    db.create_all()
    click.echo("Initialized database.")


@click.command("celery")
@with_appcontext
def worker():
    """Start the celery worker."""
    subprocess.run("celery worker -A cheddarr.celery -l debug", shell=True)
    click.echo("Celery worker started...")
