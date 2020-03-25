import json

from flask import url_for

from server.auth.models import User
from server.tests.conftest import (
    user1_password,
    user1_username,
    user2_username,
    user2_email,
)

"""
def test_get_user(client):
    assert json.loads(
        client.get(url_for("profile.public_profile", username=user1_username)).data
    ) == {"username": user1_username, "user_picture": None}
    assert (
        client.get(
            url_for("profile.public_profile", username=user1_username)
        ).status_code
        == 200
    )
"""

def test_change_password(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_password"),
            data={"oldPassword": user1_password, "newPassword": "new_password"},
        ).status_code
        == 200
    )
    assert User.find(username=user1_username).check_password("new_password")


def test_change_username_ok(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_username"), data={"username": "newUsername"},
        ).status_code
        == 200
    )
    assert User.find(username="newUsername")


def test_change_username_not_available(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_username"), data={"username": user2_username},
        ).status_code
        == 409
    )


def test_change_email_ok(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_email"), data={"email": "new@email.com"},
        ).status_code
        == 200
    )


def test_change_email_not_available(client, auth, mocks):
    assert (
        client.put(
            url_for("profile.change_email"), data={"email": user2_email},
        ).status_code
        == 409
    )
