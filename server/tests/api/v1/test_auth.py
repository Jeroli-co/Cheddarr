from async_asgi_testclient import TestClient

from server.tests.utils import Dataset


async def test_signup_ok(client: TestClient):
    resp = await client.post(
        client.application.url_path_for("signup"),
        json={
            "username": "UsernameTest",
            "password": "Test_password1",
            "email": "test@test.com",
        },
    )
    assert resp.status_code == 201


async def test_signup_user_conflict(client: TestClient):
    resp = await client.post(
        client.application.url_path_for("signup"),
        json={
            "username": Dataset.users[0].username,
            "password": "password1",
            "email": Dataset.users[0].email,
        },
    )
    assert resp.status_code == 409

async def test_signup_with_invite(db: AsyncSession, client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("invite_user"),
        json={"email": "test@test.com", "max_uses": 1},
    )

    assert resp.status_code == 201
    invite_link = resp.json()["detail"]

    resp = await client.get(invite_link)
    assert resp.status_code == 202
    invitation_code = resp.json()["detail"]["id"]

    resp = await client.post(
        client.app.url_path_for("signup"),
        params={"invitation_code": invitation_code},
        json={
            "username": "UsernameTest",
            "password": "Test_password1",
            "email": "test@test.com",
        },
    )
    assert resp.status_code == 201

    resp = await client.post(
        client.app.url_path_for("signup"),
        params={"invitation_code": invitation_code},
        json={
            "username": "UsernameTest",
            "password": "Test_password1",
            "email": "test@test.com",
        },
    )

    assert resp.status_code == 403


async def test_signin_with_email(client: TestClient):
    resp = await client.post(
        client.application.url_path_for("signin"),
        form={
            "username": Dataset.users[0].email,
            "password": "password1",
        },
    )
    assert resp.status_code == 200


async def test_signin_with_username(client: TestClient):
    resp = await client.post(
        client.application.url_path_for("signin"),
        form={
            "username": Dataset.users[0].username,
            "password": "password1",
        },
    )
    assert resp.status_code == 200


async def test_signin_wrong_username_password(client: TestClient):
    resp = await client.post(
        client.application.url_path_for("signin"),
        form={
            "username": Dataset.users[1].email,
            "password": "wrong_password",
        },
    )
    assert resp.status_code == 401


async def test_signin_unconfirmed_user(client: TestClient):
    resp = await client.post(
        client.application.url_path_for("signin"),
        form={
            "username": Dataset.users[3].email,
            "password": "password4",
        },
    )
    assert resp.status_code == 401
