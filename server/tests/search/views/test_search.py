from flask import url_for

from server.search.views import search_friends
from server.tests.conftest import user2_email, user2_username


def test_search_friends(client, auth):
    search_result = search_friends(user2_username)
    assert len(search_result) == 1
    assert (
        search_result[0]["username"] == user2_username
        and search_result[0]["email"] == user2_email
        and search_result[0]["type"] == "friend"
    )
