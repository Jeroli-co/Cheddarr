import pytest
from flask import url_for

from server import utils
from server.app import _create_app, db
from server.config import TestConfig
from server.models.users import Friendship, User

user1_id = 1
user1_username = "user1"
user1_email = "email1@test.com"
user1_password = "password1"
user2_id = 2
user2_username = "user2"
user2_email = "email2@test.com"
user2_password = "password2"
user3_id = 3
user3_username = "user3"
user3_email = "email3@test.com"
user3_password = "password3"
user4_id = 4
user4_username = "user4"
user4_email = "email4@test.com"
user4_password = "password4"
avatar = "http://avatar"


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
        db.drop_all()
        db.create_all()
        user1 = User(
            username=user1_username,
            email=user1_email,
            password=user1_password,
            avatar=avatar,
            confirmed=True,
        )
        user1.id = user1_id
        user2 = User(
            username=user2_username,
            email=user2_email,
            password=user2_password,
            avatar=avatar,
            confirmed=True,
        )
        user2.id = user2_id
        user3 = User(
            username=user3_username,
            email=user3_email,
            password=user3_password,
            avatar=avatar,
            confirmed=True,
        )
        user3.id = user3_id
        user4 = User(
            username=user4_username,
            email=user4_email,
            password=user4_password,
            avatar=avatar,
            confirmed=False,
        )
        user4.id = user4_id

        db.session.add_all((user1, user2, user3, user4))
        db.session.commit()
        friendship1 = Friendship(requesting_user=user1, receiving_user=user2)
        friendship1.pending = False
        db.session.add(friendship1)
        db.session.commit()
        yield client


@pytest.fixture(autouse=True, scope="function")
def mocks(mocker):
    mocker.patch("server.tasks.send_email.delay")
    ran_img = mocker.patch.object(utils, "random_avatar")
    ran_img.return_value = avatar


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
