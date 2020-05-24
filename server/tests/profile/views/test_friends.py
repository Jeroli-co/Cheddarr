import json

from flask import url_for
from sqlalchemy import and_

from server.auth.models import Friendship, User
from server.tests.conftest import (
    user1_username,
    user2_email,
    user2_username,
    user3_username,
)


def test_get_friends(client, auth):
    friends = client.get(url_for("profile.get_friends"))
    assert json.loads(friends.data) == [
        {"username": user2_username, "user_picture": None, "email": user2_email,}
    ]
    assert friends.status_code == 200


def test_friend_profile(client, auth):
    friend = client.get(url_for("profile.get_friends", username=user2_username))
    print(friend)
    assert json.loads(friend.data) == {
        "username": user2_username,
        "user_picture": None,
        "email": user2_email,
    }
    assert friend.status_code == 200


def test_friend_profile_not_existing(client, auth):
    assert (
        client.get(
            url_for("profile.get_friends", username="notExistingUsername")
        ).status_code
        == 404
    )


def test_add_friend_ok(client, auth):
    assert (
        client.post(
            url_for("profile.add_friend"), data={"usernameOrEmail": user3_username},
        ).status_code
        == 200
    )
    user = User.find(username=user1_username)
    friend = User.find(username=user3_username)
    assert (
        user.friends_sent.filter(
            and_(Friendship.friend_a_id == user.id, Friendship.friend_b_id == friend.id)
        ).count()
        == 1
    )


def test_add_friend_not_existing(client, auth):
    assert (
        client.post(
            url_for("profile.add_friend"),
            data={"usernameOrEmail": "notExistingUsername"},
        ).status_code
        == 400
    )


def test_add_already_friend(client, auth):
    assert (
        client.post(
            url_for("profile.add_friend"), data={"usernameOrEmail": user2_username},
        ).status_code
        == 409
    )


def test_remove_friend_ok(client, auth):
    assert (
        client.delete(
            url_for("profile.remove_friend", username=user2_username),
        ).status_code
        == 200
    )
    user = User.find(username=user1_username)
    friend = User.find(username=user2_username)
    assert (
        user.friends_sent.filter(
            and_(Friendship.friend_a_id == user.id, Friendship.friend_b_id == friend.id)
        ).count()
        == 0
    )


def test_remove_friend_not_existing(client, auth):
    assert (
        client.delete(
            url_for("profile.remove_friend", username="notExistingUsername"),
        ).status_code
        == 404
    )


def test_remove_not_friend(client, auth):
    assert (
        client.delete(
            url_for("profile.remove_friend", username=user3_username),
        ).status_code
        == 400
    )


def test_accept_friend_ok(client, auth):
    assert (
        client.patch(
            url_for("profile.accept_friend", username=user2_username),
        ).status_code
        == 200
    )
    user = User.find(username=user1_username)
    friend = User.find(username=user2_username)
    assert (
        user.friends_sent.filter(
            and_(Friendship.friend_a_id == user.id, Friendship.friend_b_id == friend.id)
        )
        .filter(Friendship.pending == False)
        .count()
        == 1
    )


def test_accept_friend_not_existing(client, auth):
    assert (
        client.patch(
            url_for("profile.accept_friend", username="notExistingUsername"),
        ).status_code
        == 404
    )


def test_accept_not_friend(client, auth):
    assert (
        client.patch(
            url_for("profile.accept_friend", username=user3_username),
        ).status_code
        == 400
    )
