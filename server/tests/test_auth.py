from flask import url_for
from server.api.users.models import User
from server.tests.conftest import (
    user1_email,
    user1_password,
    user1_username,
    user2_email,
    user2_password,
)


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
        == 200
    )
    assert User.exists(email="test@test.com")


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


def test_signup_empty_form(client):
    assert client.post(url_for("auth.signup"), data={}).status_code == 500


def test_signup_invalid_form(client):
    assert (
        client.post(
            url_for("auth.signup"), data={"wrong_username_field": user1_username}
        ).status_code
        == 422
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
