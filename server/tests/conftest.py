import pytest

from server import _create_app, db
from server.auth import User
from server.commands import init_db
from server.config import TestConfig

user1_username = "user1"
user1_email = "email1@test.com"
user1_password = "password1"
user2_username = "user2"
user2_email = "email2@test.com"
user2_password = "password2"


@pytest.fixture(autouse=True, scope="session")
def app():
    app = _create_app(TestConfig)
    ctx = app.app_context()
    ctx.push()
    yield app
    ctx.pop()


@pytest.yield_fixture(scope="session")
def client(app):
    with app.test_client() as client:
        init_db()
        user1 = User(
            username=user1_username,
            email=user1_email,
            password=user1_password,
            confirmed=True,
        )
        user1.session_token = 1
        user2 = User(
            username=user2_username,
            email=user2_email,
            password=user2_password,
            confirmed=False,
        )
        db.session.add_all((user1, user2))
        db.session.commit()
        yield client


@pytest.fixture
def auth(client):
    with client.session_transaction() as sess:
        sess["user_id"] = User.query.first().id
        sess["_fresh"] = True
