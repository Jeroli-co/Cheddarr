from flask import url_for


def test_get_index(client):
    r = client.get(url_for("index.index"))
    assert r.status_code == 200


def test_get_favicon(client):
    r = client.get(url_for("index.favicon"))
    assert r.status_code == 200
