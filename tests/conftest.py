import pytest

from server import _create_app
from server.config import TestConfig


@pytest.fixture(autouse=True, scope="session")
def app():
    app = _create_app(TestConfig, "testing.cfg", instance_relative_config=True)
    ctx = app.app_context()
    ctx.push()
    yield app
    ctx.pop()


@pytest.yield_fixture
def client(app):
    with app.test_client() as client:
        yield client
