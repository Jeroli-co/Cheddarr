import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.models.media import MediaType
from server.repositories.requests import MediaRequestRepository
from server.tests.utils import datasets

pytestmark = pytest.mark.asyncio


async def test_add_series_never_requested_without_seasons(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.post(
        client.app.url_path_for("add_series_request"),
        json={"tmdb_id": 4194, "requested_username": datasets["users"][1]["username"]},
    )
    assert resp.status_code == 201

    actual = resp.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert actual["seasons"] == expected.seasons


async def test_add_series_never_requested_with_all_seasons(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    assert resp.status_code == 201

    actual = resp.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["id"] == expected.id
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 7


async def test_add_series_already_requested_with_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={"tmdb_id": 4194, "requested_username": datasets["users"][1]["username"]},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201


async def test_add_series_already_requested_without_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={"tmdb_id": 4194, "requested_username": datasets["users"][1]["username"]},
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_season_never_requested(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert resp.status_code == 201

    actual = resp.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    assert actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 4


async def test_add_season_already_requested_conflict_with_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_season_already_requested_some_season_conflict(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 4
    assert actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    assert actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 4
    assert actual["seasons"][2]["season_number"] == expected.seasons[2].season_number == 2
    assert actual["seasons"][3]["season_number"] == expected.seasons[3].season_number == 3


async def test_add_season_whereas_all_series_requested_without_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={"tmdb_id": 4194, "requested_username": datasets["users"][1]["username"]},
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_season_whereas_all_series_requested_with_all_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_series_with_seasons_already_requested(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={"tmdb_id": 4194, "requested_username": datasets["users"][1]["username"]},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 0


async def test_add_series_with_seasons_already_requested_with_all_seasons(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 7
    assert actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    assert actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 4
    assert actual["seasons"][2]["season_number"] == expected.seasons[2].season_number == 2
    assert actual["seasons"][3]["season_number"] == expected.seasons[3].season_number == 3
    assert actual["seasons"][4]["season_number"] == expected.seasons[4].season_number == 5
    assert actual["seasons"][5]["season_number"] == expected.seasons[5].season_number == 6
    assert actual["seasons"][6]["season_number"] == expected.seasons[6].season_number == 7


async def test_add_episode_never_requested(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
                {
                    "season_number": 3,
                    "episodes": [
                        {"episode_number": 2},
                        {"episode_number": 3},
                        {"episode_number": 4},
                    ],
                },
            ],
        },
    )
    assert resp.status_code == 201

    actual = resp.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    assert actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 3
    assert len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 1
    assert len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 3
    assert (
        actual["seasons"][0]["episodes"][0]["episode_number"]
        == expected.seasons[0].episodes[0].episode_number
        == 1
    )
    assert (
        actual["seasons"][1]["episodes"][0]["episode_number"]
        == expected.seasons[1].episodes[0].episode_number
        == 2
    )
    assert (
        actual["seasons"][1]["episodes"][1]["episode_number"]
        == expected.seasons[1].episodes[1].episode_number
        == 3
    )
    assert (
        actual["seasons"][1]["episodes"][2]["episode_number"]
        == expected.seasons[1].episodes[2].episode_number
        == 4
    )


async def test_add_episode_already_requested_conflict(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
                {
                    "season_number": 3,
                    "episodes": [
                        {"episode_number": 2},
                        {"episode_number": 3},
                        {"episode_number": 4},
                    ],
                },
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
                {
                    "season_number": 3,
                    "episodes": [
                        {"episode_number": 2},
                        {"episode_number": 3},
                        {"episode_number": 4},
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_episode_already_requested_some_episodes_conflict(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
                {
                    "season_number": 3,
                    "episodes": [
                        {"episode_number": 2},
                        {"episode_number": 3},
                        {"episode_number": 4},
                    ],
                },
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
                {
                    "season_number": 2,
                    "episodes": [{"episode_number": 1}, {"episode_number": 2}],
                },
                {
                    "season_number": 3,
                    "episodes": [
                        {"episode_number": 4},
                        {"episode_number": 5},
                        {"episode_number": 6},
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 3
    assert actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    assert actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 3
    assert actual["seasons"][2]["season_number"] == expected.seasons[2].season_number == 2
    assert len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 1
    assert len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 5
    assert len(actual["seasons"][2]["episodes"]) == len(expected.seasons[2].episodes) == 2
    assert (
        actual["seasons"][0]["episodes"][0]["episode_number"]
        == expected.seasons[0].episodes[0].episode_number
        == 1
    )
    assert (
        actual["seasons"][1]["episodes"][0]["episode_number"]
        == expected.seasons[1].episodes[0].episode_number
        == 2
    )
    assert (
        actual["seasons"][1]["episodes"][1]["episode_number"]
        == expected.seasons[1].episodes[1].episode_number
        == 3
    )
    assert (
        actual["seasons"][1]["episodes"][2]["episode_number"]
        == expected.seasons[1].episodes[2].episode_number
        == 4
    )
    assert (
        actual["seasons"][1]["episodes"][3]["episode_number"]
        == expected.seasons[1].episodes[3].episode_number
        == 5
    )
    assert (
        actual["seasons"][1]["episodes"][4]["episode_number"]
        == expected.seasons[1].episodes[4].episode_number
        == 6
    )
    assert (
        actual["seasons"][2]["episodes"][0]["episode_number"]
        == expected.seasons[2].episodes[0].episode_number
        == 1
    )
    assert (
        actual["seasons"][2]["episodes"][1]["episode_number"]
        == expected.seasons[2].episodes[1].episode_number
        == 2
    )


async def test_add_episode_whereas_all_series_is_requested_without_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_episode_whereas_all_series_is_requested_with_seasons(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_series_without_seasons_whereas_episodes_requested(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 0


async def test_add_series_with_all_seasons_whereas_episodes_requested(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1},
                {"season_number": 2},
                {"season_number": 3},
                {"season_number": 4},
                {"season_number": 5},
                {"season_number": 6},
                {"season_number": 7},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 7


async def test_add_seasons_with_all_episodes_whereas_episodes_requested(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [{"episode_number": 1}, {"episode_number": 4}],
                },
                {
                    "season_number": 2,
                    "episodes": [{"episode_number": 4}, {"episode_number": 5}],
                },
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [
                        {
                            "episode_number": 1,
                        },
                        {
                            "episode_number": 2,
                        },
                        {
                            "episode_number": 3,
                        },
                        {
                            "episode_number": 4,
                        },
                        {
                            "episode_number": 5,
                        },
                        {
                            "episode_number": 6,
                        },
                        {
                            "episode_number": 7,
                        },
                        {
                            "episode_number": 8,
                        },
                        {
                            "episode_number": 9,
                        },
                        {
                            "episode_number": 10,
                        },
                        {
                            "episode_number": 11,
                        },
                        {
                            "episode_number": 12,
                        },
                        {
                            "episode_number": 13,
                        },
                        {
                            "episode_number": 14,
                        },
                        {
                            "episode_number": 15,
                        },
                        {
                            "episode_number": 16,
                        },
                        {
                            "episode_number": 17,
                        },
                        {
                            "episode_number": 18,
                        },
                        {
                            "episode_number": 19,
                        },
                        {
                            "episode_number": 20,
                        },
                        {
                            "episode_number": 21,
                        },
                        {
                            "episode_number": 22,
                        },
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(requested_user_id=datasets["users"][1]["id"])

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 22
    assert len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 2


async def test_add_seasons_without_episodes_whereas_episodes_requested(
    client: AsyncClient, db: AsyncSession
):
    media_request_repo = MediaRequestRepository(db)

    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [{"episode_number": 1}, {"episode_number": 4}],
                },
                {
                    "season_number": 2,
                    "episodes": [{"episode_number": 4}, {"episode_number": 5}],
                },
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()
    expected = await media_request_repo.find_by(
        media_type=MediaType.series, requested_user_id=datasets["users"][1]["id"]
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 0
    assert len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 2


async def test_add_episodes_whereas_all_season_requested_with_all_episodes(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [
                        {
                            "episode_number": 1,
                        },
                        {
                            "episode_number": 2,
                        },
                        {
                            "episode_number": 3,
                        },
                        {
                            "episode_number": 4,
                        },
                        {
                            "episode_number": 5,
                        },
                        {
                            "episode_number": 6,
                        },
                        {
                            "episode_number": 7,
                        },
                        {
                            "episode_number": 8,
                        },
                        {
                            "episode_number": 9,
                        },
                        {
                            "episode_number": 10,
                        },
                        {
                            "episode_number": 11,
                        },
                        {
                            "episode_number": 12,
                        },
                        {
                            "episode_number": 13,
                        },
                        {
                            "episode_number": 14,
                        },
                        {
                            "episode_number": 15,
                        },
                        {
                            "episode_number": 16,
                        },
                        {
                            "episode_number": 17,
                        },
                        {
                            "episode_number": 18,
                        },
                        {
                            "episode_number": 19,
                        },
                        {
                            "episode_number": 20,
                        },
                        {
                            "episode_number": 21,
                        },
                        {
                            "episode_number": 22,
                        },
                    ],
                },
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [{"episode_number": 1}, {"episode_number": 4}],
                }
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_episodes_whereas_all_season_requested_without_episodes(client: AsyncClient):
    r1 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                },
            ],
        },
    )
    r2 = await client.post(
        client.app.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [{"episode_number": 1}, {"episode_number": 4}],
                }
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_update_series_request_wrong_status(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_series_request", request_id="1"),
        json={"status": "available"},
    )
    assert resp.status_code == 422


async def test_update_series_request_not_existing(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_series_request", request_id="0"),
        json={"status": "approved"},
    )
    assert resp.status_code == 404


async def test_update_series_request_not_requested_user(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_series_request", request_id="2"),
        json={"status": "approved"},
    )
    assert resp.status_code == 404


async def test_update_series_request_approved_no_provider(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_series_request", request_id="1"),
        json={"status": "approved"},
    )
    assert resp.status_code == 400


async def test_delete_series_request(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.delete(client.app.url_path_for("delete_series_request", request_id="1"))
    assert resp.status_code == 200
    assert await media_request_repo.find_by(id=1) is None


async def test_delete_series_request_not_existing(client: AsyncClient):
    resp = await client.delete(client.app.url_path_for("delete_series_request", request_id="0"))
    assert resp.status_code == 404


async def test_delete_series_request_not_pending_not_requested_user(client: AsyncClient):
    resp = await client.delete(client.app.url_path_for("delete_series_request", request_id="2"))
    assert resp.status_code == 403


async def test_add_movie_never_requested(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.post(
        client.app.url_path_for("add_movie_request"),
        json={"tmdb_id": 11, "requested_username": datasets["users"][1]["username"]},
    )
    assert resp.status_code == 201
    actual = resp.json()

    expected = await media_request_repo.find_by(
        media_type=MediaType.movie, requested_user_id=datasets["users"][1]["id"]
    )
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.isoformat()
    assert actual["updated_at"] == expected.created_at.isoformat()
    assert actual["media"]


async def test_add_movie_not_existing_user(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("add_movie_request"),
        json={"tmdb_id": 11, "requested_username": "wrongusername"},
    )
    assert resp.status_code == 404


async def test_add_movie_already_requested(client: AsyncClient):
    resp = await client.post(
        client.app.url_path_for("add_movie_request"),
        json={"tmdb_id": 4194, "requested_username": datasets["users"][2]["username"]},
    )
    assert resp.status_code == 409


async def test_get_incoming_requests(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.get(client.app.url_path_for("get_received_requests"))
    assert resp.status_code == 200

    actual = resp.json()["results"]
    expected = await media_request_repo.find_all_by(requested_user_id=datasets["users"][0]["id"])

    assert len(actual) == len(expected)
    assert actual[0]["id"] == expected[0].id
    assert actual[0]["requested_user"]["username"] == expected[0].requested_user.username
    assert actual[0]["requesting_user"]["username"] == expected[0].requesting_user.username
    assert actual[0]["status"] == expected[0].status
    assert actual[0]["created_at"] == expected[0].created_at.isoformat()
    assert actual[0]["updated_at"] == expected[0].created_at.isoformat()
    assert actual[0]["media"]

    assert actual[1]["id"] == expected[1].id
    assert actual[1]["requested_user"]["username"] == expected[1].requested_user.username
    assert actual[1]["requesting_user"]["username"] == expected[1].requesting_user.username
    assert actual[1]["status"] == expected[1].status
    assert actual[1]["created_at"] == expected[1].created_at.isoformat()
    assert actual[1]["updated_at"] == expected[1].created_at.isoformat()
    assert actual[1]["media"]


async def test_get_outgoing_requests(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.get(client.app.url_path_for("get_sent_requests"))
    assert resp.status_code == 200

    actual = resp.json()["results"]
    expected = await media_request_repo.find_all_by(requesting_user_id=datasets["users"][0]["id"])

    assert len(actual) == len(expected)
    assert actual[0]["id"] == expected[0].id
    assert actual[0]["requested_user"]["username"] == expected[0].requested_user.username
    assert actual[0]["requesting_user"]["username"] == expected[0].requesting_user.username
    assert actual[0]["status"] == expected[0].status
    assert actual[0]["created_at"] == expected[0].created_at.isoformat()
    assert actual[0]["updated_at"] == expected[0].created_at.isoformat()
    assert actual[0]["media"]

    assert actual[1]["id"] == expected[1].id
    assert actual[1]["requested_user"]["username"] == expected[1].requested_user.username
    assert actual[1]["requesting_user"]["username"] == expected[1].requesting_user.username
    assert actual[1]["status"] == expected[1].status
    assert actual[1]["created_at"] == expected[1].created_at.isoformat()
    assert actual[1]["updated_at"] == expected[1].created_at.isoformat()
    assert actual[1]["media"]


async def test_update_movie_request_wrong_status(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_movie_request", request_id="1"),
        json={"status": "available"},
    )
    assert resp.status_code == 422


async def test_update_movie_request_not_existing(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_movie_request", request_id="0"),
        json={"status": "approved"},
    )
    assert resp.status_code == 404


async def test_update_movie_request_not_requested_user(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_movie_request", request_id="2"),
        json={"status": "approved"},
    )
    assert resp.status_code == 404


async def test_update_movie_request_approved_no_provider(client: AsyncClient):
    resp = await client.patch(
        client.app.url_path_for("update_movie_request", request_id="1"),
        json={"status": "approved"},
    )
    assert resp.status_code == 400


async def test_delete_movie_request(client: AsyncClient, db: AsyncSession):
    media_request_repo = MediaRequestRepository(db)

    resp = await client.delete(client.app.url_path_for("delete_movie_request", request_id="1"))
    assert resp.status_code == 200
    assert await media_request_repo.find_by(media_type=MediaType.movie, id=1) is None


async def test_delete_movie_request_not_existing(client: AsyncClient):
    resp = await client.delete(client.app.url_path_for("delete_movie_request", request_id="0"))
    assert resp.status_code == 404


async def test_delete_movie_request_not_pending_not_requested_user(client: AsyncClient):
    resp = await client.delete(client.app.url_path_for("delete_movie_request", request_id="2"))
    assert resp.status_code == 403
