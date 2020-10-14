from fastapi import FastAPI
from fastapi.testclient import TestClient


def test_get_index(app: FastAPI, client: TestClient):
    assert client.get(app.url_path_for("index", path="")).status_code == 200


def test_get_favicon(
    app: FastAPI,
    client: TestClient,
):
    assert client.get(app.url_path_for("favicon")).status_code == 200


def test_get_manifest(
    app: FastAPI,
    client: TestClient,
):
    assert client.get(app.url_path_for("manifest")).status_code == 200
