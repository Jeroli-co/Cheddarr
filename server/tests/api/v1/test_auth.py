import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.repositories.users import TokenRepository, UserRepository
from server.tests.utils import datasets

pytestmark = pytest.mark.asyncio


async def test_signup_ok(db: AsyncSession, client: AsyncClient):
    user_repo = UserRepository(db)
    resp = await client.post(
        client.app.url_path_for("signup"),
        json={
            "username": "UsernameTest",
            "password": "Test_password1",
            "email": "test@test.com",
        },
    )
    assert resp.status_code == 201
    assert await user_repo.find_by_email(email="test@test.com")


@pytest.mark.asyncio
async def test_signup_user_conflict(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("signup"),
        json={
            "username": datasets["users"][0]["username"],
            "password": datasets["users"][0]["password"],
            "email": datasets["users"][0]["email"],
        },
    )
    assert resp.status_code == 409


@pytest.mark.asyncio
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
    user_repo = UserRepository(db)
    token_repo = TokenRepository(db)
    assert resp.status_code == 201
    assert await user_repo.find_by_email(email="test@test.com")
    assert await token_repo.find_by(id=invitation_code) is None

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


@pytest.mark.asyncio
async def test_signup_with_invite_conflict(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("invite_user"),
        json={"email": datasets["users"][0]["email"]},
    )

    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_signup_with_invite_wrong_user_info(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("invite_user"),
        json={"email": "test@test.com"},
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
            "email": "wrongtest@test.com",
        },
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_signin_with_email(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("signin"),
        data={
            "username": datasets["users"][0]["email"],
            "password": datasets["users"][0]["password"],
        },
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_signin_with_username(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("signin"),
        data={
            "username": datasets["users"][0]["username"],
            "password": datasets["users"][0]["password"],
        },
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_signin_wrong_username_password(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("signin"),
        data={
            "username": datasets["users"][1]["email"],
            "password": "wrong_password",
        },
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_signin_unconfirmed_user(db: AsyncSession, client: AsyncClient):
    user_repo = UserRepository(db)
    user = await user_repo.find_by(id=datasets["users"][1]["id"])
    user.confirmed = False
    await user_repo.save(user)
    resp = await client.post(
        client.app.url_path_for("signin"),
        data={
            "username": datasets["users"][1]["email"],
            "password": datasets["users"][1]["password"],
        },
    )
    assert resp.status_code == 400
