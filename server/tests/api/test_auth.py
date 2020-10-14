import json

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server.models.users import User
from server.tests.conftest import (
    user1_email,
    user1_password,
    user1_username,
    user2_email,
    user2_password,
)


def test_signup_ok(app: FastAPI, db: Session, client: TestClient):
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
    assert db.query(User).filter_by(email="test@test.com").first()


def test_signup_user_already_exist(app: FastAPI, db: Session, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signup"),
            json={
                "username": user1_username,
                "password": user1_password,
                "email": user1_email,
            },
        ).status_code
        == 409
    )


def test_signin_with_email(app: FastAPI, db: Session, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signin"),
            data={"username": user1_email, "password": user1_password},
        ).status_code
        == 200
    )


def test_signin_with_username(app: FastAPI, db: Session, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signin"),
            data={"username": user1_username, "password": user1_password},
        ).status_code
        == 200
    )


def test_signin_wrong_username_password(app: FastAPI, db: Session, client: TestClient):
    assert (
        client.post(
            app.url_path_for("signin"),
            data={"username": user2_email, "password": "wrong_password"},
        ).status_code
        == 401
    )


def test_signin_unconfimed_user(app: FastAPI, db: Session, client: TestClient):
    user = db.query(User).filter_by(email=user2_email).first()
    user.update(db, dict(confirmed=False))
    assert (
        client.post(
            app.url_path_for("signin"),
            data={"username": user2_email, "password": user2_password},
        ).status_code
        == 400
    )
