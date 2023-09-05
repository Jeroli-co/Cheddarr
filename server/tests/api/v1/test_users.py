from async_asgi_testclient import TestClient

from server.tests.utils import Dataset


async def test_get_current_user(client: TestClient) -> None:
    resp = await client.get(client.application.url_path_for("get_current_user"))
    assert resp.status_code == 200

    current_user = resp.json()
    assert current_user["id"] == Dataset.users[0].id
    assert current_user["email"] == Dataset.users[0].email
    assert current_user["username"] == Dataset.users[0].username
    assert current_user["avatar"] == Dataset.users[0].avatar
    assert current_user["confirmed"] == Dataset.users[0].confirmed
    assert current_user["roles"] == Dataset.users[0].roles


async def test_get_user_by_id(client: TestClient) -> None:
    resp = await client.get(client.application.url_path_for("get_user_by_id", user_id=Dataset.users[1].id))
    assert resp.status_code == 200

    current_user = resp.json()
    assert current_user["username"] == Dataset.users[1].username
    assert current_user["avatar"] == Dataset.users[1].avatar


async def test_get_user_by_id_not_existing(client: TestClient) -> None:
    resp = await client.get(client.application.url_path_for("get_user_by_id", user_id=0))
    assert resp.status_code == 404


async def test_delete_user(client: TestClient) -> None:
    resp = await client.delete(client.application.url_path_for("delete_user", user_id=Dataset.users[1].id))
    assert resp.status_code == 204


async def test_update_username(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_user", user_id=Dataset.users[0].id),
        json={"username": "new_username"},
    )
    assert resp.status_code == 200


async def test_update_username_not_available(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_user", user_id=Dataset.users[0].id),
        json={"username": Dataset.users[1].username},
    )
    assert resp.status_code == 409


async def test_update_password(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_user", user_id=Dataset.users[0].id),
        json={
            "password": "new_password",
            "old_password": "password1",
        },
    )
    assert resp.status_code == 200


async def test_update_password_wrong_old_password(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_user", user_id=Dataset.users[0].id),
        json={"password": "new_password", "old_password": "wrong_password"},
    )
    assert resp.status_code == 401


async def test_update_email(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_user", user_id=Dataset.users[0].id),
        json={"email": "new@email.fake"},
    )
    assert resp.status_code == 200


async def test_update_email_not_available(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_user", user_id=Dataset.users[0].id),
        json={"email": Dataset.users[1].email},
    )
    assert resp.status_code == 409
