from async_asgi_testclient import TestClient
from fastapi import status

from server.tests.utils import Dataset


async def test_signup_ok(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("signup"),
        json={
            "username": "UsernameTest",
            "password": "Test_password1",
            "email": "test@test.com",
        },
    )
    assert resp.status_code == status.HTTP_201_CREATED


async def test_signup_user_conflict(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("signup"),
        json={
            "username": Dataset.users[0].username,
            "password": "password1",
            "email": Dataset.users[0].email,
        },
    )
    assert resp.status_code == status.HTTP_409_CONFLICT


async def test_signup_with_invite(client: TestClient) -> None:
    signup_data = {
        "username": "UsernameTest",
        "password": "Test_password1",
        "email": "email@test.com",
    }

    invitation = {"invitation_token": Dataset.invitations[0].data}

    resp = await client.post(
        client.application.url_path_for("signup"),
        query_string=invitation,
        json=signup_data,
    )
    assert resp.status_code == status.HTTP_201_CREATED

    resp = await client.post(
        client.application.url_path_for("signup"),
        query_string=invitation,
        json=signup_data,
    )

    assert resp.status_code == status.HTTP_403_FORBIDDEN


async def test_signin_with_email(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("signin"),
        json={
            "username": Dataset.users[0].email,
            "password": "password1",
        },
    )
    assert resp.status_code == status.HTTP_200_OK


async def test_signin_with_username(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("signin"),
        json={
            "username": Dataset.users[0].username,
            "password": "password1",
        },
    )
    assert resp.status_code == status.HTTP_200_OK


async def test_signin_wrong_username_password(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("signin"),
        json={
            "username": Dataset.users[1].email,
            "password": "wrong_password",
        },
    )
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED


async def test_signin_unconfirmed_user(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("signin"),
        json={
            "username": Dataset.users[3].email,
            "password": "password4",
        },
    )
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED
