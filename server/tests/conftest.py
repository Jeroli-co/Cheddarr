import pytest
from werkzeug.security import generate_password_hash

from server import _create_app, db
from server.auth import User
from server.commands import init_db
from server.config import TestConfig


@pytest.fixture(autouse=True, scope="session")
def app():
    app = _create_app(TestConfig)
    ctx = app.app_context()
    ctx.push()
    yield app
    ctx.pop()


@pytest.yield_fixture
def client(app):
    with app.test_client() as client:
        init_db()
        user = User(
            username="user1",
            first_name="test_first_name",
            last_name="test_last_name",
            email="email@test.com",
            _password=generate_password_hash("password"),
        )
        db.session.add(user)
        db.session.commit()
        yield client
