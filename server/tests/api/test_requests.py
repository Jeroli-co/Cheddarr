from datetime import date

from fastapi import FastAPI
from fastapi.testclient import TestClient
from server.tests.conftest import datasets


def test_add_series_never_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdbId": 83268, "requestedUsername": datasets["user2"]["username"]},
    )
    assert r.status_code == 201
    request = r.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 0


def test_add_series_never_requested_with_all_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    assert r.status_code == 201
    request = r.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 7


def test_add_series_already_requested_with_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdbId": 83268, "requestedUsername": datasets["user2"]["username"]},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201


def test_add_series_already_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdbId": 83268, "requestedUsername": datasets["user2"]["username"]},
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_season_never_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    assert r.status_code == 201
    request = r.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 2
    assert request["seasons"][0]["seasonNumber"] == 1
    assert request["seasons"][1]["seasonNumber"] == 4


def test_add_season_already_requested_conflict_with_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_season_already_requested_some_season_conflict(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 2}, {"seasonNumber": 3}, {"seasonNumber": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 4
    assert request["seasons"][0]["seasonNumber"] == 1
    assert request["seasons"][1]["seasonNumber"] == 4
    assert request["seasons"][2]["seasonNumber"] == 2
    assert request["seasons"][3]["seasonNumber"] == 3


def test_add_season_whereas_all_series_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdbId": 83268, "requestedUsername": datasets["user2"]["username"]},
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
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
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_series_with_seasons_already_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={"tvdbId": 83268, "requestedUsername": datasets["user2"]["username"]},
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 0


def test_add_series_with_seasons_already_requested_with_all_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [{"seasonNumber": 1}, {"seasonNumber": 4}],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 7
    assert request["seasons"][0]["seasonNumber"] == 1
    assert request["seasons"][1]["seasonNumber"] == 4
    assert request["seasons"][2]["seasonNumber"] == 2
    assert request["seasons"][3]["seasonNumber"] == 3
    assert request["seasons"][4]["seasonNumber"] == 5
    assert request["seasons"][5]["seasonNumber"] == 6
    assert request["seasons"][6]["seasonNumber"] == 7


def test_add_episode_never_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
                {
                    "seasonNumber": 3,
                    "episodes": [
                        {"episodeNumber": 2},
                        {"episodeNumber": 3},
                        {"episodeNumber": 4},
                    ],
                },
            ],
        },
    )
    assert r.status_code == 201
    request = r.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 2
    assert request["seasons"][0]["seasonNumber"] == 1
    assert request["seasons"][1]["seasonNumber"] == 3
    assert len(request["seasons"][0]["episodes"]) == 1
    assert len(request["seasons"][1]["episodes"]) == 3
    assert request["seasons"][0]["episodes"][0]["episodeNumber"] == 1
    assert request["seasons"][1]["episodes"][0]["episodeNumber"] == 2
    assert request["seasons"][1]["episodes"][1]["episodeNumber"] == 3
    assert request["seasons"][1]["episodes"][2]["episodeNumber"] == 4


def test_add_episode_already_requested_conflict(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
                {
                    "seasonNumber": 3,
                    "episodes": [
                        {"episodeNumber": 2},
                        {"episodeNumber": 3},
                        {"episodeNumber": 4},
                    ],
                },
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
                {
                    "seasonNumber": 3,
                    "episodes": [
                        {"episodeNumber": 2},
                        {"episodeNumber": 3},
                        {"episodeNumber": 4},
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_episode_already_requested_some_episodes_conflict(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
                {
                    "seasonNumber": 3,
                    "episodes": [
                        {"episodeNumber": 2},
                        {"episodeNumber": 3},
                        {"episodeNumber": 4},
                    ],
                },
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
                {
                    "seasonNumber": 2,
                    "episodes": [{"episodeNumber": 1}, {"episodeNumber": 2}],
                },
                {
                    "seasonNumber": 3,
                    "episodes": [
                        {"episodeNumber": 4},
                        {"episodeNumber": 5},
                        {"episodeNumber": 6},
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 3
    assert request["seasons"][0]["seasonNumber"] == 1
    assert request["seasons"][1]["seasonNumber"] == 3
    assert request["seasons"][2]["seasonNumber"] == 2
    assert len(request["seasons"][0]["episodes"]) == 1
    assert len(request["seasons"][1]["episodes"]) == 5
    assert len(request["seasons"][2]["episodes"]) == 2
    assert request["seasons"][0]["episodes"][0]["episodeNumber"] == 1
    assert request["seasons"][1]["episodes"][0]["episodeNumber"] == 2
    assert request["seasons"][1]["episodes"][1]["episodeNumber"] == 3
    assert request["seasons"][1]["episodes"][2]["episodeNumber"] == 4
    assert request["seasons"][1]["episodes"][3]["episodeNumber"] == 5
    assert request["seasons"][1]["episodes"][4]["episodeNumber"] == 6
    assert request["seasons"][2]["episodes"][0]["episodeNumber"] == 1
    assert request["seasons"][2]["episodes"][1]["episodeNumber"] == 2


def test_add_episode_whereas_all_series_is_requested_without_seasons(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
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
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409


def test_add_series_without_seasons_whereas_episodes_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 0


def test_add_series_with_all_seasons_whereas_episodes_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1, "episodes": [{"episodeNumber": 1}]},
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {"seasonNumber": 1},
                {"seasonNumber": 2},
                {"seasonNumber": 3},
                {"seasonNumber": 4},
                {"seasonNumber": 5},
                {"seasonNumber": 6},
                {"seasonNumber": 7},
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 7


def test_add_seasons_with_all_episodes_whereas_episodes_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                    "episodes": [{"episodeNumber": 1}, {"episodeNumber": 4}],
                },
                {
                    "seasonNumber": 2,
                    "episodes": [{"episodeNumber": 4}, {"episodeNumber": 5}],
                },
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                    "episodes": [
                        {
                            "episodeNumber": 1,
                        },
                        {
                            "episodeNumber": 2,
                        },
                        {
                            "episodeNumber": 3,
                        },
                        {
                            "episodeNumber": 4,
                        },
                        {
                            "episodeNumber": 5,
                        },
                        {
                            "episodeNumber": 6,
                        },
                        {
                            "episodeNumber": 7,
                        },
                        {
                            "episodeNumber": 8,
                        },
                        {
                            "episodeNumber": 9,
                        },
                        {
                            "episodeNumber": 10,
                        },
                        {
                            "episodeNumber": 11,
                        },
                        {
                            "episodeNumber": 12,
                        },
                        {
                            "episodeNumber": 13,
                        },
                        {
                            "episodeNumber": 14,
                        },
                        {
                            "episodeNumber": 15,
                        },
                        {
                            "episodeNumber": 16,
                        },
                        {
                            "episodeNumber": 17,
                        },
                        {
                            "episodeNumber": 18,
                        },
                        {
                            "episodeNumber": 19,
                        },
                        {
                            "episodeNumber": 20,
                        },
                        {
                            "episodeNumber": 21,
                        },
                        {
                            "episodeNumber": 22,
                        },
                    ],
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 2
    assert len(request["seasons"][0]["episodes"]) == 22
    assert len(request["seasons"][1]["episodes"]) == 2


def test_add_seasons_without_episodes_whereas_episodes_requested(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                    "episodes": [{"episodeNumber": 1}, {"episodeNumber": 4}],
                },
                {
                    "seasonNumber": 2,
                    "episodes": [{"episodeNumber": 4}, {"episodeNumber": 5}],
                },
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                },
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 201
    request = r2.json()
    assert request["status"] == "pending"
    assert request["requestedUser"]["username"] == datasets["user2"]["username"]
    assert request["requestingUser"]["username"] == datasets["user1"]["username"]
    assert (
        request["createdAt"]
        == request["updatedAt"]
        == date.today().strftime("%Y-%m-%d")
    )
    assert request["series"]
    assert len(request["seasons"]) == 2
    assert len(request["seasons"][0]["episodes"]) == 0
    assert len(request["seasons"][1]["episodes"]) == 2


def test_add_episodes_whereas_all_season_requested_with_all_episodes(
    app: FastAPI, client: TestClient, normal_user_token_headers, mock_tmdb
):
    r1 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                    "episodes": [
                        {
                            "episodeNumber": 1,
                        },
                        {
                            "episodeNumber": 2,
                        },
                        {
                            "episodeNumber": 3,
                        },
                        {
                            "episodeNumber": 4,
                        },
                        {
                            "episodeNumber": 5,
                        },
                        {
                            "episodeNumber": 6,
                        },
                        {
                            "episodeNumber": 7,
                        },
                        {
                            "episodeNumber": 8,
                        },
                        {
                            "episodeNumber": 9,
                        },
                        {
                            "episodeNumber": 10,
                        },
                        {
                            "episodeNumber": 11,
                        },
                        {
                            "episodeNumber": 12,
                        },
                        {
                            "episodeNumber": 13,
                        },
                        {
                            "episodeNumber": 14,
                        },
                        {
                            "episodeNumber": 15,
                        },
                        {
                            "episodeNumber": 16,
                        },
                        {
                            "episodeNumber": 17,
                        },
                        {
                            "episodeNumber": 18,
                        },
                        {
                            "episodeNumber": 19,
                        },
                        {
                            "episodeNumber": 20,
                        },
                        {
                            "episodeNumber": 21,
                        },
                        {
                            "episodeNumber": 22,
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
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                    "episodes": [{"episodeNumber": 1}, {"episodeNumber": 4}],
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
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                },
            ],
        },
    )
    r2 = client.post(
        app.url_path_for("add_series_request"),
        headers=normal_user_token_headers,
        json={
            "tvdbId": 83268,
            "requestedUsername": datasets["user2"]["username"],
            "seasons": [
                {
                    "seasonNumber": 1,
                    "episodes": [{"episodeNumber": 1}, {"episodeNumber": 4}],
                }
            ],
        },
    )
    assert r1.status_code == 201
    assert r2.status_code == 409
