import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.security import generate_timed_token
from server.repositories.users import UserRepository
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
async def test_signup_user_already_exist(client: AsyncClient):

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
async def test_confirm_email_invalid_link(client: AsyncClient):

    resp = await client.get(client.app.url_path_for("confirm_email", token="invalid"))
    assert resp.status_code == 410


@pytest.mark.asyncio
async def test_confirm_email_not_existing(client: AsyncClient):
    token = generate_timed_token({"email": "not_existing_email@fake.com"})
    resp = await client.get(
        client.app.url_path_for("confirm_email", token=token),
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_confirm_email_already_confirmed(client: AsyncClient):
    token = generate_timed_token({"email": datasets["users"][0]["email"]})
    resp = await client.get(
        client.app.url_path_for("confirm_email", token=token),
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_confirm_email(db: AsyncSession, client: AsyncClient):
    user_repo = UserRepository(db)
    token = generate_timed_token({"email": datasets["users"][3]["email"]})
    resp = await client.get(
        client.app.url_path_for("confirm_email", token=token),
    )
    assert resp.status_code == 200
    user = await user_repo.find_by(id=datasets["users"][3]["id"])
    assert user.confirmed


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
async def test_signin_unconfimed_user(db: AsyncSession, client: AsyncClient):
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
