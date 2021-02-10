from datetime import date

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from server.tests.utils import datasets


def test_add_series_never_requested_without_seasons(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdb_id": 83268, "requested_username": datasets["users"][1]["username"]},
    )
    assert r.status_code == 201
    from server.models import SeriesRequest

    actual = r.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert actual["seasons"] == expected.seasons


def test_add_series_never_requested_with_all_seasons(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    assert r.status_code == 201
    from server.models import SeriesRequest

    actual = r.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["id"] == expected.id
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 7


def test_add_series_already_requested_with_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdb_id": 83268, "requested_username": datasets["users"][1]["username"]},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201


def test_add_series_already_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdb_id": 83268, "requested_username": datasets["users"][1]["username"]},
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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


def test_add_season_never_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r.status_code == 201
    from server.models import SeriesRequest

    actual = r.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert (
        actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    )
    assert (
        actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 4
    )


def test_add_season_already_requested_conflict_with_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_season_already_requested_some_season_conflict(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 4
    assert (
        actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    )
    assert (
        actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 4
    )
    assert (
        actual["seasons"][2]["season_number"] == expected.seasons[2].season_number == 2
    )
    assert (
        actual["seasons"][3]["season_number"] == expected.seasons[3].season_number == 3
    )


def test_add_season_whereas_all_series_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdb_id": 83268, "requested_username": datasets["users"][1]["username"]},
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_season_whereas_all_series_requested_with_all_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_series_with_seasons_already_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdb_id": 83268, "requested_username": datasets["users"][1]["username"]},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 0


def test_add_series_with_seasons_already_requested_with_all_seasons(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [{"season_number": 1}, {"season_number": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 7
    assert (
        actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    )
    assert (
        actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 4
    )
    assert (
        actual["seasons"][2]["season_number"] == expected.seasons[2].season_number == 2
    )
    assert (
        actual["seasons"][3]["season_number"] == expected.seasons[3].season_number == 3
    )
    assert (
        actual["seasons"][4]["season_number"] == expected.seasons[4].season_number == 5
    )
    assert (
        actual["seasons"][5]["season_number"] == expected.seasons[5].season_number == 6
    )
    assert (
        actual["seasons"][6]["season_number"] == expected.seasons[6].season_number == 7
    )


def test_add_episode_never_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    assert r.status_code == 201

    from server.models import SeriesRequest

    actual = r.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert (
        actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    )
    assert (
        actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 3
    )
    assert (
        len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 1
    )
    assert (
        len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 3
    )
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


def test_add_episode_already_requested_conflict(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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


def test_add_episode_already_requested_some_episodes_conflict(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 3
    assert (
        actual["seasons"][0]["season_number"] == expected.seasons[0].season_number == 1
    )
    assert (
        actual["seasons"][1]["season_number"] == expected.seasons[1].season_number == 3
    )
    assert (
        actual["seasons"][2]["season_number"] == expected.seasons[2].season_number == 2
    )
    assert (
        len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 1
    )
    assert (
        len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 5
    )
    assert (
        len(actual["seasons"][2]["episodes"]) == len(expected.seasons[2].episodes) == 2
    )
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


def test_add_episode_whereas_all_series_is_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_episode_whereas_all_series_is_requested_with_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_series_without_seasons_whereas_episodes_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 0


def test_add_series_with_all_seasons_whereas_episodes_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {"season_number": 1, "episodes": [{"episode_number": 1}]},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 7


def test_add_seasons_with_all_episodes_whereas_episodes_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert (
        len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 22
    )
    assert (
        len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 2
    )


def test_add_seasons_without_episodes_whereas_episodes_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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

    from server.models import SeriesRequest

    actual = r2.json()
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )

    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert len(actual["seasons"]) == len(expected.seasons) == 2
    assert (
        len(actual["seasons"][0]["episodes"]) == len(expected.seasons[0].episodes) == 0
    )
    assert (
        len(actual["seasons"][1]["episodes"]) == len(expected.seasons[1].episodes) == 2
    )


def test_add_episodes_whereas_all_season_requested_with_all_episodes(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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


def test_add_episodes_whereas_all_season_requested_without_episodes(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
            "requested_username": datasets["users"][1]["username"],
            "seasons": [
                {
                    "season_number": 1,
                },
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdb_id": 83268,
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


def test_get_incoming_series_requests(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_received_series_requests"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    from server.models import SeriesRequest

    actual = r.json()[0]
    expected = (
        db.query(SeriesRequest)
        .filter_by(requested_user_id=datasets["users"][0]["id"])
        .first()
    )

    assert actual["id"] == expected.id
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert actual["seasons"] == expected.seasons


def test_get_outgoing_series_requests(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_sent_series_requests"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    from server.models import SeriesRequest

    actual = r.json()[0]
    expected = (
        db.query(SeriesRequest)
        .filter_by(requesting_user_id=datasets["users"][0]["id"])
        .first()
    )

    assert actual["id"] == expected.id
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["series"]
    assert actual["seasons"] == expected.seasons


def test_update_series_request_wrong_status(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_series_request", request_id="1"),
        headers=normal_user_token_headers,
        json={"status": "available"},
    )
    assert r.status_code == 422


def test_update_series_request_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_series_request", request_id="0"),
        headers=normal_user_token_headers,
        json={"status": "approved"},
    )
    assert r.status_code == 404


def test_update_series_request_not_requested_user(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_series_request", request_id="2"),
        headers=normal_user_token_headers,
        json={"status": "approved"},
    )
    assert r.status_code == 404


def test_update_series_request_approved_no_provider(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_series_request", request_id="1"),
        headers=normal_user_token_headers,
        json={"status": "approved"},
    )
    assert r.status_code == 400


def test_delete_series_request(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    from server.repositories import SeriesRequestRepository

    series_request_repo = SeriesRequestRepository(db)

    r = client.delete(
        app.url_path_for("delete_series_request", request_id="1"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert series_request_repo.find_by(id=1) is None


def test_delete_series_request_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_series_request", request_id="0"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_delete_series_request_not_pending_not_requested_user(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_series_request", request_id="2"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 403


def test_add_movie_never_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_movie_request"),
        headers=normal_user_token_headers,
        json={"tmdb_id": 11, "requested_username": datasets["users"][1]["username"]},
    )
    assert r.status_code == 201
    actual = r.json()
    from server.models import MovieRequest

    expected = (
        db.query(MovieRequest)
        .filter_by(requested_user_id=datasets["users"][1]["id"])
        .first()
    )
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["movie"]


def test_add_movie_not_existing_user(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_movie_request"),
        headers=normal_user_token_headers,
        json={"tmdb_id": 11, "requested_username": "wrongusername"},
    )
    assert r.status_code == 404


def test_add_movie_already_requested(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_movie_request"),
        headers=normal_user_token_headers,
        json={"tmdb_id": 11, "requested_username": datasets["users"][2]["username"]},
    )
    assert r.status_code == 409


def test_get_incoming_movies_requests(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_received_movie_requests"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    from server.models import MovieRequest

    actual = r.json()[0]
    expected = (
        db.query(MovieRequest)
        .filter_by(requested_user_id=datasets["users"][0]["id"])
        .first()
    )

    assert actual["id"] == expected.id
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["movie"]


def test_get_outgoing_movies_requests(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    r = client.get(
        app.url_path_for("get_sent_movie_requests"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    from server.models import MovieRequest

    actual = r.json()[0]
    expected = (
        db.query(MovieRequest)
        .filter_by(requesting_user_id=datasets["users"][0]["id"])
        .first()
    )

    assert actual["id"] == expected.id
    assert actual["requested_user"]["username"] == expected.requested_user.username
    assert actual["requesting_user"]["username"] == expected.requesting_user.username
    assert actual["status"] == expected.status
    assert actual["created_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["updated_at"] == expected.created_at.strftime("%Y-%m-%d")
    assert actual["movie"]


def test_update_movie_request_wrong_status(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_movie_request", request_id="1"),
        headers=normal_user_token_headers,
        json={"status": "available"},
    )
    assert r.status_code == 422


def test_update_movie_request_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_movie_request", request_id="0"),
        headers=normal_user_token_headers,
        json={"status": "approved"},
    )
    assert r.status_code == 404


def test_update_movie_request_not_requested_user(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_movie_request", request_id="2"),
        headers=normal_user_token_headers,
        json={"status": "approved"},
    )
    assert r.status_code == 404


def test_update_movie_request_approved_no_provider(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.patch(
        app.url_path_for("update_movie_request", request_id="1"),
        headers=normal_user_token_headers,
        json={"status": "approved"},
    )
    assert r.status_code == 400


def test_delete_movie_request(
    app: FastAPI, client: TestClient, db: Session, normal_user_token_headers
):
    from server.repositories import MovieRequestRepository

    movies_request_repo = MovieRequestRepository(db)

    r = client.delete(
        app.url_path_for("delete_movie_request", request_id="1"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 200
    assert movies_request_repo.find_by(id=1) is None


def test_delete_movie_request_not_existing(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_movie_request", request_id="0"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 404


def test_delete_movie_request_not_pending_not_requested_user(
    app: FastAPI, client: TestClient, normal_user_token_headers
):
    r = client.delete(
        app.url_path_for("delete_movie_request", request_id="2"),
        headers=normal_user_token_headers,
    )
    assert r.status_code == 403
