from importlib import reload

from flask import url_for
from server.auth import User
from server import utils


def test_signup_ok(client, mocker):
    mocker.patch.object(utils, "send_email")
    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": "test_user",
                "password": "Test_password1",
                "email": "test@test.com",
                "firstName": "test",
                "lastName": "test",
            },
        ).status_code
        == 200
    )
    assert User.exists("test@test.com")


def test_signup_user_already_exist(client):
    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": "user1",
                "password": "password1",
                "email": "email1@test.com",
                "firstName": "user1_first_name",
                "lastName": "user1_last_name",
            },
        ).status_code
        == 409
    )


def test_signup_invalid_form(client):
    assert client.post(url_for("auth.signup"), data={}).status_code == 500
