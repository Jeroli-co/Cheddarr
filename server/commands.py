import click
from flask.cli import with_appcontext
from server import db


@click.command("init-db")
@with_appcontext
def init_db():
    """Initialize database"""
    db.create_all()
    click.echo("Initialized database")
