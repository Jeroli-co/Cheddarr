from flask import url_for
from server.api.auth.models import User
from server.tests.conftest import (
    user1_password,
    user1_username,
    user2_email,
    user2_username,
)


def test_change_password(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_password"),
            data={"oldPassword": user1_password, "newPassword": "new_password"},
        ).status_code
        == 200
    )
    assert User.find(username=user1_username).password.secret == "new_password"


def test_change_username_ok(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_username"),
            data={"username": "newUsername"},
        ).status_code
        == 200
    )
    assert User.find(username="newUsername")


def test_change_username_not_available(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_username"),
            data={"username": user2_username},
        ).status_code
        == 409
    )


def test_change_email_ok(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_email"),
            data={"email": "new@email.com"},
        ).status_code
        == 200
    )


def test_change_email_not_available(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_email"),
            data={"email": user2_email},
        ).status_code
        == 409
    )


def test_delete_user(client, auth, mocks):
    assert (
        client.delete(
            url_for("profile.delete_user"),
            data={"password": user1_password},
        ).status_code
        == 200
    )
    assert not User.find(user1_username)
