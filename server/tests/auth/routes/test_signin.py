from flask import url_for


def test_signin_with_email(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": "email1@test.com", "password": "password1"},
        ).status_code
        == 200
    )


def test_signin_with_username(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": "user1", "password": "password1"},
        ).status_code
        == 200
    )


def test_signin_wrong_username_password(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": "email2@test.com", "password": "wrong_password"},
        ).status_code
        == 400
    )


def test_signin_unconfimed_user(client):
    assert (
        client.post(
            url_for("auth.signin"),
            data={"usernameOrEmail": "email2@test.com", "password": "password2"},
        ).status_code
        == 401
    )


def test_signin_invalid_form(client):
    assert client.post(url_for("auth.signin"), data={}).status_code == 500
