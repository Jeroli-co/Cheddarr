from flask import url_for
from server.auth import User
from server import utils
from server.tests.conftest import user1_username, user1_password, user1_email


def test_signup_ok(client, mocker):
    mocker.patch.object(utils, "send_email")
    ran_img = mocker.patch.object(utils, "random_user_picture")
    ran_img.return_value = ""
    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": "test_user",
                "password": "Test_password1",
                "email": "test@test.com",
            },
        ).status_code
        == 201
    )
    assert User.exists("test@test.com")


def test_signup_user_already_exist(client, mocker):
    ran_img = mocker.patch.object(utils, "random_user_picture")
    ran_img.return_value = ""
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
