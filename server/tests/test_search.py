import json

from flask.helpers import url_for

from server.tests.conftest import user2_email, user2_username


def test_search_friends(client, auth):
    search_result = json.loads(
        client.get(
            url_for("search.search_all", value=user2_username, type="friends")
        ).data
    )
    print(search_result)
    assert len(search_result) == 1
    assert (
        search_result[0]["username"] == user2_username
        and search_result[0]["email"] == user2_email
        and search_result[0]["type"] == "friend"
    )
