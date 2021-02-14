from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server.core.security import generate_timed_token
from server.repositories import UserRepository
from server.tests.utils import datasets


def test_signup_ok(db: Session, client: TestClient):
    user_repo = UserRepository(db)
    assert (
        client.post(
            client.app.url_path_for("signup"),
            json={
                "username": "UsernameTest",
                "password": "Test_password1",
                "email": "test@test.com",
            },
        ).status_code
        == 201
    )
    assert user_repo.find_by_email(email="test@test.com")


def test_signup_user_already_exist(client: TestClient):
    assert (
        client.post(
            client.app.url_path_for("signup"),
            json={
                "username": datasets["users"][0]["username"],
                "password": datasets["users"][0]["password"],
                "email": datasets["users"][0]["email"],
            },
        ).status_code
        == 409
    )


def test_confirm_email_invalid_link(client: TestClient):
    assert (
        client.get(
            client.app.url_path_for("confirm_email", token="invalid"),
        ).status_code
        == 410
    )


def test_confirm_email_not_existing(client: TestClient):
    token = generate_timed_token({"email": "not_existing_email@fake.com"})
    assert (
        client.get(
            client.app.url_path_for("confirm_email", token=token),
        ).status_code
        == 404
    )


def test_confirm_email_already_confirmed(client: TestClient):
    token = generate_timed_token({"email": datasets["users"][0]["email"]})
    r = client.get(
        client.app.url_path_for("confirm_email", token=token),
    )
    assert r.status_code == 403


def test_confirm_email(db: Session, client: TestClient):
    user_repo = UserRepository(db)
    token = generate_timed_token({"email": datasets["users"][3]["email"]})
    r = client.get(
        client.app.url_path_for("confirm_email", token=token),
    )
    assert r.status_code == 200
    assert user_repo.find_by(id=datasets["users"][3]["id"]).confirmed


def test_signin_with_email(client: TestClient):
    assert (
        client.post(
            client.app.url_path_for("signin"),
            data={
                "username": datasets["users"][0]["email"],
                "password": datasets["users"][0]["password"],
            },
        ).status_code
        == 200
    )


def test_signin_with_username(client: TestClient):
    assert (
        client.post(
            client.app.url_path_for("signin"),
            data={
                "username": datasets["users"][0]["username"],
                "password": datasets["users"][0]["password"],
            },
        ).status_code
        == 200
    )


def test_signin_wrong_username_password(client: TestClient):
    assert (
        client.post(
            client.app.url_path_for("signin"),
            data={
                "username": datasets["users"][1]["email"],
                "password": "wrong_password",
            },
        ).status_code
        == 401
    )


def test_signin_unconfimed_user(db: Session, client: TestClient):
    user_repo = UserRepository(db)
    user = user_repo.find_by(id=datasets["users"][1]["id"])
    user.confirmed = False
    user_repo.save(user)
    assert (
        client.post(
            client.app.url_path_for("signin"),
            data={
                "username": datasets["users"][1]["email"],
                "password": datasets["users"][1]["password"],
            },
        ).status_code
        == 400
    )
