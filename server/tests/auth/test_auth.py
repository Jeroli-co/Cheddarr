from flask import url_for


def test_sign_up_ok(client):
    assert client.post(
        url_for("auth.signup"),
        data={"username": "test_user",
              "password": "Test_password1",
              "email": "email@test.com",
              "firstName": "test",
              "lastName": "test"
              }
    ).status_code == 200


def test_signup_user_already_exist(client):
    
    return True


def test_signup_invalid_form(client):

    assert client.post(
        url_for("auth.signup"),
        data={}
    ).status_code == 500
