from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server.core.security import generate_timed_token
from server.repositories import UserRepository
from server.tests.conftest import datasets


def test_signup_ok(app: FastAPI, db: Session, client: TestClient):
    user_repo = UserRepository(db)
    assert (
        client.post(
            app.url_path_for("signup"),
            json={
                "username": "UsernameTest",
                "password": "Test_password1",
                "email": "test@test.com",
            },
        ).status_code
        == 201
    )
    assert user_repo.find_by_email(email="test@test.com")


def test_signup_user_already_exist(app: FastAPI, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signup"),
            json={
                "username": datasets["user1"]["username"],
                "password": datasets["user1"]["password"],
                "email": datasets["user1"]["email"],
            },
        ).status_code
        == 409
    )


def test_confirm_email_invalid_link(app: FastAPI, client: TestClient):
    assert (
        client.get(
            app.url_path_for("confirm_email", token="invalid"),
        ).status_code
        == 410
    )


def test_confirm_email_not_existing(app: FastAPI, client: TestClient):
    token = generate_timed_token({"email": "not_existing_email@fake.com"})
    assert (
        client.get(
            app.url_path_for("confirm_email", token=token),
        ).status_code
        == 404
    )


def test_confirm_email_already_confirmed(app: FastAPI, client: TestClient):
    token = generate_timed_token({"email": datasets["user1"]["email"]})
    r = client.get(
        app.url_path_for("confirm_email", token=token),
    )
    assert r.status_code == 403


def test_confirm_email(app: FastAPI, db: Session, client: TestClient):
    user_repo = UserRepository(db)
    token = generate_timed_token({"email": datasets["user4"]["email"]})
    r = client.get(
        app.url_path_for("confirm_email", token=token),
    )
    assert r.status_code == 200
    assert user_repo.find_by(id=datasets["user4"]["id"]).confirmed


def test_signin_with_email(app: FastAPI, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signin"),
            data={
                "username": datasets["user1"]["email"],
                "password": datasets["user1"]["password"],
            },
        ).status_code
        == 200
    )


def test_signin_with_username(app: FastAPI, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signin"),
            data={
                "username": datasets["user1"]["username"],
                "password": datasets["user1"]["password"],
            },
        ).status_code
        == 200
    )


def test_signin_wrong_username_password(app: FastAPI, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signin"),
            data={"username": datasets["user2"]["email"], "password": "wrong_password"},
        ).status_code
        == 401
    )


def test_signin_unconfimed_user(app: FastAPI, db: Session, client: TestClient):
    user_repo = UserRepository(db)
    user = user_repo.find_by(id=datasets["user2"]["id"])
    user.confirmed = False
    user_repo.save(user)
    assert (
        client.post(
            app.url_path_for("signin"),
            data={
                "username": datasets["user2"]["email"],
                "password": datasets["user2"]["password"],
            },
        ).status_code
        == 400
    )
