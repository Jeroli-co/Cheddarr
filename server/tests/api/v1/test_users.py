import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.security import verify_password
from server.repositories.users import FriendshipRepository, UserRepository
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
        client.app.url_path_for("get_user_by_id", id=datasets["users"][1]["id"])
    )
    assert resp.status_code == 200
    current_user = resp.json()
    assert current_user["email"] == datasets["users"][1]["email"]
    assert current_user["username"] == datasets["users"][1]["username"]
    assert current_user["avatar"] == datasets["users"][1]["avatar"]


async def test_get_user_by_id_not_existing(client: AsyncClient):
    resp = await client.get(client.app.url_path_for("get_user_by_id", id=0))
    assert resp.status_code == 404


async def test_get_user_by_username(client: AsyncClient):
    resp = await client.get(
        client.app.url_path_for("get_user_by_username", username=datasets["users"][1]["username"])
    )
    assert resp.status_code == 200
    current_user = resp.json()
    assert current_user["email"] == datasets["users"][1]["email"]
    assert current_user["username"] == datasets["users"][1]["username"]
    assert current_user["avatar"] == datasets["users"][1]["avatar"]


async def test_get_user_by_username_not_existing(client: AsyncClient):
    resp = await client.get(
        client.app.url_path_for("get_user_by_username", username="not_exsting_username")
    )
    assert resp.status_code == 404


async def test_delete_current_user(client: AsyncClient, db: AsyncSession):
    user_repo = UserRepository(db)
    resp = await client.delete(client.app.url_path_for("delete_user"))
    assert resp.status_code == 200
    assert await user_repo.find_by(id=datasets["users"][0]["id"]) is None


async def test_update_username(client: AsyncClient, db: AsyncSession):
    user_repo = UserRepository(db)
    resp = await client.patch(
        client.app.url_path_for("update_user"),
        json={"username": "new_username"},
    )
    assert resp.status_code == 200
    assert await user_repo.find_by_username("new_username")


async def test_update_username_not_avilable(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user"),
        json={"username": datasets["users"][1]["username"]},
    )
    assert resp.status_code == 409


async def test_update_password(client: AsyncClient, db: AsyncSession):
    user_repo = UserRepository(db)
    resp = await client.patch(
        client.app.url_path_for("update_user"),
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
        client.app.url_path_for("update_user"), json={"password": "new_passowrd"}
    )
    assert resp.status_code == 422


async def test_update_password_wrong_old_password(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user"),
        json={"password": "new_password", "old_password": "wrong_password"},
    )
    assert resp.status_code == 401


async def test_update_email(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user"), json={"email": "new@email.fake"}
    )
    assert resp.status_code == 200


async def test_update_email_not_available(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_user"), json={"email": datasets["users"][1]["email"]}
    )
    assert resp.status_code == 409


async def test_get_friends(client: AsyncClient):
    resp = await client.get(client.app.url_path_for("get_friends"))
    friends = resp.json()
    assert resp.status_code == 200
    assert len(friends) == 1
    assert friends[0]["username"] == datasets["users"][1]["username"]
    assert friends[0]["email"] == datasets["users"][1]["email"]
    assert friends[0]["avatar"] == datasets["users"][1]["avatar"]


async def test_add_friend(client: AsyncClient, db: AsyncSession):
    friendship_repo = FriendshipRepository(db)
    assert (
        len(
            await friendship_repo.find_all_by(
                requesting_user_id=datasets["users"][0]["id"], pending=True
            )
        )
        == 1
    )
    assert (
        len(
            await friendship_repo.find_all_by(
                requested_user_id=datasets["users"][2]["id"], pending=True
            )
        )
        == 0
    )
    resp = await client.post(
        client.app.url_path_for("add_friend"),
        json={"username_or_email": datasets["users"][2]["username"]},
    )
    assert resp.status_code == 201
    assert (
        len(
            await friendship_repo.find_all_by(
                requesting_user_id=datasets["users"][0]["id"], pending=True
            )
        )
        == 2
    )
    assert (
        len(
            await friendship_repo.find_all_by(
                requested_user_id=datasets["users"][2]["id"], pending=True
            )
        )
        == 1
    )


async def test_add_friend_not_exsting(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("add_friend"), json={"username_or_email": "not_existing_username"}
    )
    assert resp.status_code == 404


async def test_add_friend_already_friend(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("add_friend"),
        json={"username_or_email": datasets["users"][1]["username"]},
    )
    assert resp.status_code == 409


async def test_accept_friend(client: AsyncClient, db: AsyncSession):
    friendship_repo = FriendshipRepository(db)
    friendship = await friendship_repo.find_by_user_ids(
        user_id=datasets["users"][0]["id"],
        other_user_id=datasets["users"][3]["id"],
    )
    assert friendship.pending
    resp = await client.patch(
        client.app.url_path_for("accept_friend", username=datasets["users"][3]["username"])
    )
    assert resp.status_code == 200
    friendship = await friendship_repo.find_by_user_ids(
        user_id=datasets["users"][0]["id"],
        other_user_id=datasets["users"][3]["id"],
    )
    assert friendship.pending is False


async def test_accept_friend_not_existing(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("accept_friend", username="not_existing_username")
    )
    assert resp.status_code == 404


async def test_accept_friend_not_friend(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("accept_friend", username=datasets["users"][2]["username"])
    )
    assert resp.status_code == 403


async def test_remove_friend(client: AsyncClient, db: AsyncSession):
    friendship_repo = FriendshipRepository(db)
    assert friendship_repo.find_by_user_ids(
        user_id=datasets["users"][0]["id"],
        other_user_id=datasets["users"][1]["id"],
    )
    resp = await client.delete(
        client.app.url_path_for("remove_friend", username=datasets["users"][1]["username"])
    )
    assert resp.status_code == 200
    assert (
        await friendship_repo.find_by_user_ids(
            user_id=datasets["users"][0]["id"],
            other_user_id=datasets["users"][1]["id"],
        )
        is None
    )


async def test_remove_friend_not_existing(client: AsyncClient):
    resp = await client.delete(
        client.app.url_path_for("remove_friend", username="not_existing_username")
    )
    assert resp.status_code == 404


async def test_remove_friend_not_friend(client: AsyncClient):
    resp = await client.delete(
        client.app.url_path_for("remove_friend", username=datasets["users"][2]["username"])
    )
    assert resp.status_code == 403
