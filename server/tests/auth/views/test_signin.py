from flask import url_for

from server.tests.conftest import (
    user1_email,
    user1_password,
    user1_username,
    user2_email,
    user2_password,
)


def test_signin_with_email(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": user1_email, "password": user1_password},
        ).status_code
        == 200
    )


def test_signin_with_username(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": user1_username, "password": user1_password},
        ).status_code
        == 200
    )


def test_signin_wrong_username_password(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": user2_email, "password": "wrong_password"},
        ).status_code
        == 400
    )


def test_signin_unconfimed_user(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": user2_email, "password": user2_password},
        ).status_code
        == 401
    )


def test_signin_invalid_form(client):
    assert client.post(url_for("auth.signin"), data={}).status_code == 422
