import json

from flask import url_for
from server.api.users.models import Friendship, User
from server.tests.conftest import (
    avatar,
    user1_email,
    user2_id,
    user3_id,
    user1_id,
    user1_password,
    user1_username,
    user2_email,
    user2_username,
    user3_username,
)


def test_get_user(client, auth):
    user = client.get(url_for("users.get_user"))
    assert json.loads(user.data) == {
        "id": 1,
        "username": user1_username,
        "confirmed": True,
        "avatar": avatar,
        "email": user1_email,
        "friends": [
            {
                "username": user2_username,
                "avatar": avatar,
                "email": user2_email,
                "_links": {
                    "self": url_for(
                        "users.get_user", username=user2_username, _external=True
                    )
                },
            }
        ],
        "_links": {
            "self": url_for("users.get_user", username=user1_username, _external=True)
        },
    }
    assert user.status_code == 200


def test_get_user_by_username(client, auth):
    user = client.get(url_for("users.get_user", username=user2_username))
    assert json.loads(user.data) == {
        "username": user2_username,
        "avatar": avatar,
        "email": user2_email,
        "_links": {
            "self": url_for("users.get_user", username=user2_username, _external=True)
        },
    }
    assert user.status_code == 200


def test_get_user_by_username_not_existing(client, auth):
    assert (
        client.get(
            url_for("users.get_user", username="notExistingUsername")
        ).status_code
        == 404
    )


def test_get_user_by_id(client, auth):
    user = client.get(url_for("users.get_user", id=2))
    assert json.loads(user.data) == {
        "username": user2_username,
        "avatar": avatar,
        "email": user2_email,
        "_links": {
            "self": url_for("users.get_user", username=user2_username, _external=True)
        },
    }
    assert user.status_code == 200


def test_get_user_by_id_not_existing(client, auth):
    assert client.get(url_for("users.get_user", id=0)).status_code == 404


def test_change_password(client, auth):
    assert (
        client.put(
            url_for("users.change_password"),
            data={"oldPassword": user1_password, "newPassword": "new_password"},
        ).status_code
        == 200
    )
    assert User.find(id=user1_id).password.secret == "new_password"


def test_change_username_ok(client, auth, session):
    assert (
        client.patch(
            url_for("users.update_user"),
            json={"username": "newUsername"},
        ).status_code
        == 200
    )
    assert User.find(username="newUsername")


def test_change_username_not_available(client, auth):
    assert (
        client.patch(
            url_for("users.update_user"),
            json={"username": user2_username},
        ).status_code
        == 409
    )


def test_change_email_ok(client, auth):
    assert (
        client.patch(
            url_for("users.update_user"),
            json={"email": "new@email.com"},
        ).status_code
        == 200
    )


def test_change_email_not_available(client, auth):
    assert (
        client.patch(
            url_for("users.update_user"),
            json={"email": user2_email},
        ).status_code
        == 409
    )


def test_delete_user(client, auth):
    assert (
        client.delete(
            url_for("users.delete_user"),
            data={"password": user1_password},
        ).status_code
        == 200
    )
    assert not User.find(id=user1_id)


def test_get_friends(client, auth):
    friends = client.get(url_for("users.get_friends"))
    assert json.loads(friends.data) == [
        {
            "username": user2_username,
            "avatar": avatar,
            "email": user2_email,
            "_links": {
                "self": url_for(
                    "users.get_user", username=user2_username, _external=True
                )
            },
        }
    ]
    assert friends.status_code == 200


def test_add_friend_ok(client, auth):
    assert (
        client.post(
            url_for("users.add_friend"),
            data={"usernameOrEmail": user3_username},
        ).status_code
        == 200
    )
    user = User.find(id=user1_id)
    print(user)
    friend = User.find(id=user3_id)
    assert Friendship.find(requesting_user=user, receiving_user=friend)


def test_add_friend_not_existing(client, auth):
    assert (
        client.post(
            url_for("users.add_friend"),
            data={"usernameOrEmail": "notExistingUsername"},
        ).status_code
        == 400
    )


def test_add_already_friend(client, auth):
    assert (
        client.post(
            url_for("users.add_friend"),
            data={"usernameOrEmail": user2_username},
        ).status_code
        == 409
    )


def test_remove_friend_ok(client, auth):
    assert (
        client.delete(
            url_for("users.remove_friend", username=user2_username),
        ).status_code
        == 200
    )
    user = User.find(id=user1_id)
    friend = User.find(id=user2_id)
    friends = (user.requested_friends.union(user.received_friends)).all()
    assert friend not in friends


def test_remove_friend_not_existing(client, auth):
    assert (
        client.delete(
            url_for("users.remove_friend", username="notExistingUsername"),
        ).status_code
        == 404
    )


def test_remove_not_friend(client, auth):
    assert (
        client.delete(
            url_for("users.remove_friend", username=user3_username),
        ).status_code
        == 400
    )


def test_accept_friend_ok(client, auth):
    assert (
        client.patch(
            url_for("users.accept_friend", username=user2_username),
        ).status_code
        == 200
    )
    user = User.find(id=user1_id)
    friend = User.find(id=user2_id)
    friends = (
        user.requested_friends.filter_by(pending=False).union(
            user.received_friends.filter_by(pending=False)
        )
    ).all()
    assert friend not in friends


def test_accept_friend_not_existing(client, auth):
    assert (
        client.patch(
            url_for("users.accept_friend", username="notExistingUsername"),
        ).status_code
        == 404
    )


def test_accept_not_friend(client, auth):
    assert (
        client.patch(
            url_for("users.accept_friend", username=user3_username),
        ).status_code
        == 400
    )
