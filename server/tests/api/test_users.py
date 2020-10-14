import json

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server.models import User
from server.tests.conftest import (
    user1_email,
    user2_id,
    user1_id,
    user1_password,
    user1_username,
    user2_email,
    user2_username,
    avatar_url,
    user3_id,
    user3_username,
    user4_username,
)


def test_get_current_user(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.get(
        app.url_path_for("get_current_user"), headers=normal_user_token_headers
    )
    assert r.status_code == 200
    current_user = r.json()
    assert current_user["email"] == user1_email
    assert current_user["username"] == user1_username
    assert current_user["avatar"] == avatar_url
    assert len(current_user["friends"]) == 1
    assert current_user["confirmed"] is True
    assert current_user["admin"] is False


def test_get_user_by_id(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.get(
        app.url_path_for("get_user_by_id", id=user2_id),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    current_user = r.json()
    assert current_user["email"] == user2_email
    assert current_user["username"] == user2_username
    assert current_user["avatar"] == avatar_url


def test_get_user_by_id_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_user_by_id", id=0),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_get_user_by_username(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_user_by_username", username=user2_username),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    current_user = r.json()
    assert current_user["email"] == user2_email
    assert current_user["username"] == user2_username
    assert current_user["avatar"] == avatar_url


def test_get_user_by_username_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_user_by_username", username="not_exsting_username"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_delete_current_user(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_user", id=user1_id),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert db.query(User).get(user1_id) is None


def test_delete_other_user_as_non_admin(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_user", id=user2_id),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 401


def test_delete_other_user_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_user", id=0),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_update_user_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user", id=0),
        headers=normal_user_token_headers,
        json={"username": "some_username"},
    )
    assert r.status_code == 404


def test_update_other_user_as_non_admin(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user", id=user2_id),
        headers=normal_user_token_headers,
        json={"username": "some_username"},
    )
    assert r.status_code == 403


def test_update_username(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"username": "new_username"},
    )
    assert r.status_code == 200


def test_update_username_not_avilable(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"username": user2_username},
    )
    assert r.status_code == 409


def test_update_password(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"password": "new_password", "oldPassword": user1_password},
    )
    assert r.status_code == 200


def test_update_password_missing_old_password(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"password": "new_passowrd"},
    )
    assert r.status_code == 400


def test_update_password_wrong_old_password(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"password": "new_password", "oldPassword": "wrong_password"},
    )
    assert r.status_code == 401


def test_update_email(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"email": "new@email.fake"},
    )
    assert r.status_code == 200


def test_update_email_not_available(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user", id=user1_id),
        headers=normal_user_token_headers,
        json={"email": user2_email},
    )
    assert r.status_code == 409


def test_reset_password_wrong_email(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.put(
        app.url_path_for("reset_password"),
        headers=normal_user_token_headers,
        json={"email": "non_existing@email.fake"},
    )
    assert r.status_code == 404


def test_get_friends(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.get(
        app.url_path_for("get_friends"),
        headers=normal_user_token_headers,
    )
    friends = r.json()
    assert r.status_code == 200
    assert len(friends) == 1
    assert friends[0]["username"] == user2_username
    assert friends[0]["email"] == user2_email
    assert friends[0]["avatar"] == avatar_url


def test_add_friend(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    assert len(db.query(User).get(user1_id).pending_requested_friends) == 1
    assert len(db.query(User).get(user3_id).pending_received_friends) == 0
    r = client.post(
        app.url_path_for("add_friend"),
        headers=normal_user_token_headers,
        json={"usernameOrEmail": user3_username},
    )
    assert r.status_code == 201
    assert len(db.query(User).get(user1_id).pending_requested_friends) == 2
    assert len(db.query(User).get(user3_id).pending_received_friends) == 1


def test_add_friend_not_exsting(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.post(
        app.url_path_for("add_friend"),
        headers=normal_user_token_headers,
        json={"usernameOrEmail": "not_existing_username"},
    )
    assert r.status_code == 404


def test_add_friend_already_friend(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.post(
        app.url_path_for("add_friend"),
        headers=normal_user_token_headers,
        json={"usernameOrEmail": user2_username},
    )
    assert r.status_code == 409


def test_accept_friend_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("accept_friend", username="not_existing_username"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_accept_friend_not_friend(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("accept_friend", username=user3_username),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 403


def test_accept_friend(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    assert len(db.query(User).get(user1_id).pending_requested_friends) == 1
    r = client.patch(
        app.url_path_for("accept_friend", username=user4_username),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert len(db.query(User).get(user1_id).pending_requested_friends) == 0


def test_remove_friend(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    assert len(db.query(User).get(user1_id).friends) == 1
    r = client.delete(
        app.url_path_for("remove_friend", username=user2_username),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert len(db.query(User).get(user1_id).friends) == 0


def test_remove_friend_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("remove_friend", username="not_existing_username"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_remove_friend_not_friend(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("remove_friend", username=user3_username),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 403
