from flask import url_for


def test_get_index(client):
    assert client.get(url_for("site.index")).status_code == 200


def test_get_favicon(client):
    assert client.get(url_for("site.favicon")).status_code == 200
