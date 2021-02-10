from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server import models
from server.core.security import verify_password
from server.repositories import FriendshipRepository, UserRepository
from server.tests.utils import datasets


def test_get_current_user(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.get(
        app.url_path_for("get_current_user"), headers=normal_user_token_headers
    )
    assert r.status_code == 200
    current_user = r.json()
    assert current_user["email"] == datasets["users"][0]["email"]
    assert current_user["username"] == datasets["users"][0]["username"]
    assert current_user["avatar"] == datasets["users"][0]["avatar"]
    assert current_user["confirmed"] is True
    assert current_user["role"] == models.UserRole.user


def test_get_user_by_id(app: FastAPI, client: TestClient, normal_user_token_headers):
    r = client.get(
        app.url_path_for("get_user_by_id", id=datasets["users"][1]["id"]),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    current_user = r.json()
    assert current_user["email"] == datasets["users"][1]["email"]
    assert current_user["username"] == datasets["users"][1]["username"]
    assert current_user["avatar"] == datasets["users"][1]["avatar"]


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
        app.url_path_for(
            "get_user_by_username", username=datasets["users"][1]["username"]
        ),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    current_user = r.json()
    assert current_user["email"] == datasets["users"][1]["email"]
    assert current_user["username"] == datasets["users"][1]["username"]
    assert current_user["avatar"] == datasets["users"][1]["avatar"]


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
    user_repo = UserRepository(db)
    r = client.delete(
        app.url_path_for("delete_user"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert user_repo.find_by(id=datasets["users"][0]["id"]) is None


def test_update_username(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    user_repo = UserRepository(db)
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={"username": "new_username"},
    )
    assert r.status_code == 200
    assert user_repo.find_by_username("new_username")


def test_update_username_not_avilable(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={"username": datasets["users"][1]["username"]},
    )
    assert r.status_code == 409


def test_update_password(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    user_repo = UserRepository(db)
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={
            "password": "new_password",
            "old_password": datasets["users"][0]["password"],
        },
    )
    assert r.status_code == 200
    assert verify_password(
        "new_password", user_repo.find_by(id=datasets["users"][0]["id"]).password
    )


def test_update_password_missing_old_password(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={"password": "new_passowrd"},
    )
    assert r.status_code == 422


def test_update_password_wrong_old_password(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={"password": "new_password", "old_password": "wrong_password"},
    )
    assert r.status_code == 401


def test_update_email(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={"email": "new@email.fake"},
    )
    assert r.status_code == 200


def test_update_email_not_available(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_user"),
        headers=normal_user_token_headers,
        json={"email": datasets["users"][1]["email"]},
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
    assert friends[0]["username"] == datasets["users"][1]["username"]
    assert friends[0]["email"] == datasets["users"][1]["email"]
    assert friends[0]["avatar"] == datasets["users"][1]["avatar"]


def test_add_friend(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    friendship_repo = FriendshipRepository(db)
    assert (
        len(
            friendship_repo.find_all_by(
                requesting_user_id=datasets["users"][0]["id"], pending=True
            )
        )
        == 1
    )
    assert (
        len(
            friendship_repo.find_all_by(
                requested_user_id=datasets["users"][2]["id"], pending=True
            )
        )
        == 0
    )
    r = client.post(
        app.url_path_for("add_friend"),
        headers=normal_user_token_headers,
        json={"username_or_email": datasets["users"][2]["username"]},
    )
    assert r.status_code == 201
    assert (
        len(
            friendship_repo.find_all_by(
                requesting_user_id=datasets["users"][0]["id"], pending=True
            )
        )
        == 2
    )
    assert (
        len(
            friendship_repo.find_all_by(
                requested_user_id=datasets["users"][2]["id"], pending=True
            )
        )
        == 1
    )


def test_add_friend_not_exsting(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.post(
        app.url_path_for("add_friend"),
        headers=normal_user_token_headers,
        json={"username_or_email": "not_existing_username"},
    )
    assert r.status_code == 404


def test_add_friend_already_friend(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.post(
        app.url_path_for("add_friend"),
        headers=normal_user_token_headers,
        json={"username_or_email": datasets["users"][1]["username"]},
    )
    assert r.status_code == 409


def test_accept_friend(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    friendship_repo = FriendshipRepository(db)
    assert friendship_repo.find_by_user_ids(
        user_id=datasets["users"][0]["id"],
        other_user_id=datasets["users"][3]["id"],
    ).pending
    r = client.patch(
        app.url_path_for("accept_friend", username=datasets["users"][3]["username"]),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert (
        friendship_repo.find_by_user_ids(
            user_id=datasets["users"][0]["id"],
            other_user_id=datasets["users"][3]["id"],
        ).pending
        is False
    )


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
        app.url_path_for("accept_friend", username=datasets["users"][2]["username"]),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 403


def test_remove_friend(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    friendship_repo = FriendshipRepository(db)
    assert friendship_repo.find_by_user_ids(
        user_id=datasets["users"][0]["id"],
        other_user_id=datasets["users"][1]["id"],
    )
    r = client.delete(
        app.url_path_for("remove_friend", username=datasets["users"][1]["username"]),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert (
        friendship_repo.find_by_user_ids(
            user_id=datasets["users"][0]["id"],
            other_user_id=datasets["users"][1]["id"],
        )
        is None
    )


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
        app.url_path_for("remove_friend", username=datasets["users"][2]["username"]),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 403
