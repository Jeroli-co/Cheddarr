from async_asgi_testclient import TestClient

from server.models.requests import RequestStatus
from server.tests.utils import Dataset


async def test_add_series_never_requested_without_seasons(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_series_request"),
        json={"tmdb_id": 60554},
    )
    assert resp.status_code == 201

    actual = resp.json()

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]


async def test_add_series_never_requested_with_all_seasons(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 7


async def test_add_series_already_requested_with_seasons(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={"tmdb_id": 60554},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201


async def test_add_series_already_requested_without_seasons(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "seasons": [
                {"season_number": 1},
            ],
        },
    )
    assert resp.status_code == 409


async def test_add_season_never_requested(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert resp.status_code == 201

    actual = resp.json()

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 2
    assert actual["seasons"][0]["season_number"] == 1
    assert actual["seasons"][1]["season_number"] == 4


async def test_add_season_already_requested_conflict_with_seasons(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_season_already_requested_some_season_conflict(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 4
    assert actual["seasons"][0]["season_number"] == 1
    assert actual["seasons"][1]["season_number"] == 4
    assert actual["seasons"][2]["season_number"] == 2
    assert actual["seasons"][3]["season_number"] == 3


async def test_add_season_whereas_all_series_requested_with_all_seasons(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_series_with_seasons_already_requested(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={"tmdb_id": 60554},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 0


async def test_add_series_with_seasons_already_requested_with_all_seasons(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 7
    assert actual["seasons"][0]["season_number"] == 1
    assert actual["seasons"][1]["season_number"] == 4
    assert actual["seasons"][2]["season_number"] == 2
    assert actual["seasons"][3]["season_number"] == 3
    assert actual["seasons"][4]["season_number"] == 5
    assert actual["seasons"][5]["season_number"] == 6
    assert actual["seasons"][6]["season_number"] == 7


async def test_add_episode_never_requested(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 2
    assert actual["seasons"][0]["season_number"] == 1
    assert actual["seasons"][1]["season_number"] == 3
    assert len(actual["seasons"][0]["episodes"]) == 1
    assert len(actual["seasons"][1]["episodes"]) == 3
    assert actual["seasons"][0]["episodes"][0]["episode_number"] == 1
    assert actual["seasons"][1]["episodes"][0]["episode_number"] == 2
    assert actual["seasons"][1]["episodes"][1]["episode_number"] == 3
    assert actual["seasons"][1]["episodes"][2]["episode_number"] == 4


async def test_add_episode_already_requested_conflict(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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


async def test_add_episode_already_requested_some_episodes_conflict(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 3
    assert actual["seasons"][0]["season_number"] == 1
    assert actual["seasons"][1]["season_number"] == 3
    assert actual["seasons"][2]["season_number"] == 2
    assert len(actual["seasons"][0]["episodes"]) == 1
    assert len(actual["seasons"][1]["episodes"]) == 5
    assert len(actual["seasons"][2]["episodes"]) == 2
    assert actual["seasons"][0]["episodes"][0]["episode_number"] == 1
    assert actual["seasons"][1]["episodes"][0]["episode_number"] == 2
    assert actual["seasons"][1]["episodes"][1]["episode_number"] == 3
    assert actual["seasons"][1]["episodes"][2]["episode_number"] == 4
    assert actual["seasons"][1]["episodes"][3]["episode_number"] == 5
    assert actual["seasons"][1]["episodes"][4]["episode_number"] == 6
    assert actual["seasons"][2]["episodes"][0]["episode_number"] == 1
    assert actual["seasons"][2]["episodes"][1]["episode_number"] == 2


async def test_add_episode_whereas_all_series_is_requested_without_seasons(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 4194,
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    assert resp.status_code == 409


async def test_add_episode_whereas_all_series_is_requested_with_seasons(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_series_without_seasons_whereas_episodes_requested(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={"tmdb_id": 60554},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 0


async def test_add_series_with_all_seasons_whereas_episodes_requested(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 7


async def test_add_seasons_with_all_episodes_whereas_episodes_requested(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [
                        {"episode_number": 1},
                        {"episode_number": 2},
                        {"episode_number": 3},
                        {"episode_number": 4},
                        {"episode_number": 5},
                        {"episode_number": 6},
                        {"episode_number": 7},
                        {"episode_number": 8},
                        {"episode_number": 9},
                        {"episode_number": 10},
                        {"episode_number": 11},
                        {"episode_number": 12},
                        {"episode_number": 13},
                        {"episode_number": 14},
                        {"episode_number": 15},
                        {"episode_number": 16},
                        {"episode_number": 17},
                        {"episode_number": 18},
                        {"episode_number": 19},
                        {"episode_number": 20},
                        {"episode_number": 21},
                        {"episode_number": 22},
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    actual = r2.json()

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 2
    assert len(actual["seasons"][0]["episodes"]) == 22
    assert len(actual["seasons"][1]["episodes"]) == 2


async def test_add_seasons_without_episodes_whereas_episodes_requested(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
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

    assert actual["id"] == len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]
    assert len(actual["seasons"]) == 2
    assert len(actual["seasons"][0]["episodes"]) == 0
    assert len(actual["seasons"][1]["episodes"]) == 2


async def test_add_episodes_whereas_all_season_requested_with_all_episodes(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [
                        {"episode_number": 1},
                        {"episode_number": 2},
                        {"episode_number": 3},
                        {"episode_number": 4},
                        {"episode_number": 5},
                        {"episode_number": 6},
                        {"episode_number": 7},
                        {"episode_number": 8},
                        {"episode_number": 9},
                        {"episode_number": 10},
                        {"episode_number": 11},
                        {"episode_number": 12},
                        {"episode_number": 13},
                        {"episode_number": 14},
                        {"episode_number": 15},
                        {"episode_number": 16},
                        {"episode_number": 17},
                        {"episode_number": 18},
                        {"episode_number": 19},
                        {"episode_number": 20},
                        {"episode_number": 21},
                        {"episode_number": 22},
                    ],
                },
            ],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [{"episode_number": 1}, {"episode_number": 4}],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_add_episodes_whereas_all_season_requested_without_episodes(client: TestClient) -> None:
    r1 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {
                    "season_number": 1,
                },
            ],
        },
    )
    r2 = await client.post(
        client.application.url_path_for("add_series_request"),
        json={
            "tmdb_id": 60554,
            "seasons": [
                {
                    "season_number": 1,
                    "episodes": [{"episode_number": 1}, {"episode_number": 4}],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


async def test_update_series_request_wrong_status(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_series_request", request_id="1"),
        json={"status": "available"},
    )
    assert resp.status_code == 422


async def test_update_series_request_not_existing(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_series_request", request_id="0"),
        json={"status": "approved"},
    )
    assert resp.status_code == 404


async def test_update_series_request_approved_no_provider(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_series_request", request_id="1"),
        json={"status": "approved"},
    )
    assert resp.status_code == 400


async def test_delete_series_request(client: TestClient) -> None:
    resp = await client.delete(client.application.url_path_for("delete_series_request", request_id="1"))
    assert resp.status_code == 204


async def test_delete_series_request_not_existing(client: TestClient) -> None:
    resp = await client.delete(client.application.url_path_for("delete_series_request", request_id="0"))
    assert resp.status_code == 404


async def test_add_movie_never_requested(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_movie_request"),
        json={"tmdb_id": 13475},
    )
    assert resp.status_code == 201
    actual = resp.json()

    len(Dataset.series_requests) + len(Dataset.movies_requests) + 1
    assert actual["requesting_user"]["username"] == Dataset.users[0].username
    assert actual["status"] == RequestStatus.pending
    assert actual["media"]


async def test_add_movie_already_requested(client: TestClient) -> None:
    resp = await client.post(
        client.application.url_path_for("add_movie_request"),
        json={"tmdb_id": 4194},
    )
    assert resp.status_code == 409


async def test_get_incoming_requests(client: TestClient) -> None:
    resp = await client.get(client.application.url_path_for("get_received_requests"))
    assert resp.status_code == 200

    actual = resp.json()["results"]

    assert len(actual) == len(Dataset.series_requests) + len(Dataset.movies_requests)

    assert actual[0]["id"] == Dataset.series_requests[0].id
    assert actual[0]["requesting_user"]["username"] == Dataset.users[2].username
    assert actual[0]["status"] == RequestStatus.pending
    assert actual[0]["media"]

    assert actual[1]["id"] == Dataset.series_requests[1].id
    assert actual[1]["requesting_user"]["username"] == Dataset.users[0].username
    assert actual[1]["status"] == RequestStatus.pending
    assert actual[1]["media"]

    assert actual[2]["id"] == Dataset.movies_requests[0].id
    assert actual[2]["requesting_user"]["username"] == Dataset.users[2].username
    assert actual[2]["status"] == RequestStatus.pending
    assert actual[2]["media"]

    assert actual[3]["id"] == Dataset.movies_requests[1].id
    assert actual[3]["requesting_user"]["username"] == Dataset.users[0].username
    assert actual[3]["status"] == RequestStatus.pending
    assert actual[3]["media"]


async def test_get_outgoing_requests(client: TestClient) -> None:
    resp = await client.get(client.application.url_path_for("get_sent_requests"))
    assert resp.status_code == 200

    actual = resp.json()["results"]

    assert len(actual) == 2

    assert actual[0]["id"] == Dataset.series_requests[1].id
    assert actual[0]["requesting_user"]["username"] == Dataset.users[0].username
    assert actual[0]["status"] == RequestStatus.pending
    assert actual[0]["media"]

    assert actual[1]["id"] == Dataset.movies_requests[1].id
    assert actual[1]["requesting_user"]["username"] == Dataset.users[0].username
    assert actual[1]["status"] == RequestStatus.pending
    assert actual[1]["media"]


async def test_update_movie_request_wrong_status(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_movie_request", request_id="1"),
        json={"status": "available"},
    )
    assert resp.status_code == 422


async def test_update_movie_request_not_existing(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_movie_request", request_id="0"),
        json={"status": "approved"},
    )
    assert resp.status_code == 404


async def test_update_movie_request_approved_no_provider(client: TestClient) -> None:
    resp = await client.patch(
        client.application.url_path_for("update_movie_request", request_id="1"),
        json={"status": "approved"},
    )
    assert resp.status_code == 400


async def test_delete_movie_request(client: TestClient) -> None:
    resp = await client.delete(client.application.url_path_for("delete_movie_request", request_id="1"))
    assert resp.status_code == 204


async def test_delete_movie_request_not_existing(client: TestClient) -> None:
    resp = await client.delete(client.application.url_path_for("delete_movie_request", request_id="0"))
    assert resp.status_code == 404
