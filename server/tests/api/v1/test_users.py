import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.security import verify_password
from server.repositories.users import UserRepository
from server.tests.utils import datasets

pytestmark = pytest.mark.asyncio


async def test_get_current_user(client: AsyncClient):
    resp = await client.get(client.app.url_path_for("get_current_user"))
    assert resp.status_code == 200
    current_user = resp.json()

    assert current_user["email"] == datasets["users"][0]["email"]
    assert current_user["username"] == datasets["users"][0]["username"]
    assert current_user["avatar"] == datasets["users"][0]["avatar"]
    assert current_user["confirmed"] is True
    assert current_user["roles"]


async def test_get_user_by_id(client: AsyncClient):
    resp = await client.get(
        client.app.url_path_for("get_user_by_id", user_id=datasets["users"][1]["id"])
    )
    assert resp.status_code == 200
    current_user = resp.json()
    assert current_user["email"] == datasets["users"][1]["email"]
    assert current_user["username"] == datasets["users"][1]["username"]
    assert current_user["avatar"] == datasets["users"][1]["avatar"]


async def test_get_user_by_id_not_existing(client: AsyncClient):
    resp = await client.get(client.app.url_path_for("get_user_by_id", user_id=0))
    assert resp.status_code == 404


async def test_delete_user(client: AsyncClient, db: AsyncSession):
    user_repo = UserRepository(db)
    resp = await client.delete(
        client.app.url_path_for("delete_user", user_id=datasets["users"][0]["id"])
    )
    assert resp.status_code == 200
    assert await user_repo.find_by(id=datasets["users"][0]["id"]) is None


async def test_update_username(client: AsyncClient, db: AsyncSession):
    user_repo = UserRepository(db)
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={"username": "new_username"},
    )
    assert resp.status_code == 200
    assert await user_repo.find_by_username("new_username")


async def test_update_username_not_avilable(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={"username": datasets["users"][1]["username"]},
    )
    assert resp.status_code == 409


async def test_update_password(client: AsyncClient, db: AsyncSession):
    user_repo = UserRepository(db)
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={
            "password": "new_password",
            "old_password": datasets["users"][0]["password"],
        },
    )
    user = await user_repo.find_by(id=datasets["users"][0]["id"])
    assert resp.status_code == 200
    assert verify_password("new_password", user.password)


async def test_update_password_missing_old_password(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={"password": "new_passowrd"},
    )
    assert resp.status_code == 422


async def test_update_password_wrong_old_password(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={"password": "new_password", "old_password": "wrong_password"},
    )
    assert resp.status_code == 401


async def test_update_email(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={"email": "new@email.fake"},
    )
    assert resp.status_code == 200


async def test_update_email_not_available(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user", user_id=datasets["users"][0]["id"]),
        json={"email": datasets["users"][1]["email"]},
    )
    assert resp.status_code == 409
