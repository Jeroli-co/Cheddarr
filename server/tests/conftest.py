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
        user1 = User(
            username="user1",
            first_name="user1_first_name",
            last_name="user1_last_name",
            email="email1@test.com",
            _password=generate_password_hash("password1"),
        )
        user1.confirmed = True
        user2 = User(
            username="user2",
            first_name="user1_first_name",
            last_name="user2_last_name",
            email="email2@test.com",
            _password=generate_password_hash("password2"),
        )
        db.session.add_all((user1, user2))
        db.session.commit()
        yield client
