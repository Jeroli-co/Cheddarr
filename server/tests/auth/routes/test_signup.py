from flask import url_for
from server.auth.models import User
from server.tests.conftest import user1_username, user1_password, user1_email


def test_signup_ok(client, mocks):

    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": "UsernameTest",
                "password": "Test_password1",
                "email": "test@test.com",
            },
        ).status_code
        == 201
    )
    assert User.exists("test@test.com")


def test_signup_user_already_exist(client, mocks):
    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": user1_username,
                "password": user1_password,
                "email": user1_email,
            },
        ).status_code
        == 409
    )


def test_signup_invalid_form(client):
    assert client.post(url_for("auth.signup"), data={}).status_code == 500
