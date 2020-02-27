import click
from flask.cli import with_appcontext
from server import db


@click.command("init-db")
@with_appcontext
def init_db_command():
    """Initialize database"""
    init_db()
    click.echo("Initialized database")


def init_db():
    db.drop_all()
    db.create_all()
