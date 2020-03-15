from flask import url_for


def test_sign_up_ok(client):
    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": "test_user",
                "password": "Test_password1",
                "email": "email@test.com",
                "firstName": "test",
                "lastName": "test",
            },
        ).status_code
        == 200
    )


def test_signup_user_already_exist(client):
    assert (
        client.post(
            url_for("auth.signup"),
            data={
                "username": "user1",
                "password": "password",
                "email": "email@test.com",
                "firstName": "test_first_name",
                "lastName": "test_last_name",
            },
        ).status_code
        == 409
    )


def test_signup_invalid_form(client):

    assert client.post(url_for("auth.signup"), data={}).status_code == 500
