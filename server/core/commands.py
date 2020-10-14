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
    subprocess.run("uvicorn server.main:app --reload")
