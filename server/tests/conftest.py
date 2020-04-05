import pytest
from flask import url_for

from server import _create_app, db, utils
from server.auth.models.user import User, Friendship
from server.commands import init_db
from server.config import TestConfig

user1_username = "user1"
user1_email = "email1@test.com"
user1_password = "password1"
user2_username = "user2"
user2_email = "email2@test.com"
user2_password = "password2"
user3_username = "user3"
user3_email = "email3@test.com"
user3_password = "password3"


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
        user2 = User(
            username=user2_username,
            email=user2_email,
            password=user2_password,
            confirmed=False,
        )
        user3 = User(
            username=user3_username,
            email=user3_email,
            password=user3_password,
            confirmed=True,
        )

        db.session.add_all((user1, user2, user3))
        db.session.commit()
        friendship1 = Friendship(
            friend_a_id=user1.id, friend_b_id=user2.id, pending=True
        )
        db.session.add(friendship1)
        db.session.commit()
        yield client


@pytest.fixture
def mocks(mocker):
    mocker.patch.object(utils, "send_email")
    ran_img = mocker.patch.object(utils, "random_user_picture")
    ran_img.return_value = ""


@pytest.fixture
def auth(client):
    return client.post(
        url_for("auth.signin"),
        data={"usernameOrEmail": user1_email, "password": user1_password},
    )


@pytest.fixture(autouse=True, scope="function")
def session():
    session = db.session
    session.begin_nested()

    yield session

    session.rollback()
