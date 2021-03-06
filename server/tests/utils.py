from typing import Dict

from fastapi.testclient import TestClient

from server.models.media import MediaType
from server.models.requests import RequestStatus


def user_authentication_headers(
    *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}
    r = client.post("/sign-in", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


datasets = {
    "users": [
        {
            "id": 1,
            "username": "user1",
            "email": "email1@test.com",
            "password": "password1",
            "avatar": "http://avatar.fake",
            "confirmed": True,
        },
        {
            "id": 2,
            "username": "user2",
            "email": "email2@test.com",
            "password": "password2",
            "avatar": "http://avatar.fake",
            "confirmed": True,
        },
        {
            "id": 3,
            "username": "user3",
            "email": "email3@test.com",
            "password": "password3",
            "avatar": "http://avatar.fake",
            "confirmed": True,
        },
        {
            "id": 4,
            "username": "user4",
            "email": "email4@test.com",
            "password": "password4",
            "avatar": "http://avatar.fake",
            "confirmed": False,
        },
    ],
    "series": [
        {
            "id": 1,
            "title": "Star Wars: The Clone Wars",
            "tmdb_id": 4194,
            "tvdb_id": 83268,
            "media_type": MediaType.series,
        }
    ],
    "series_requests": [
        {
            "id": 1,
            "requesting_user_id": 3,
            "requested_user_id": 1,
            "status": RequestStatus.pending,
            "media_id": 1,
            "media_type": MediaType.series,
        },
        {
            "id": 2,
            "requesting_user_id": 1,
            "requested_user_id": 3,
            "status": RequestStatus.approved,
            "media_id": 1,
            "media_type": MediaType.series,
        },
    ],
    "movies": [
        {
            "id": 2,
            "title": "Star Wars",
            "tmdb_id": 11,
            "media_type": MediaType.movies,
        }
    ],
    "movies_requests": [
        {
            "id": 3,
            "requesting_user_id": 3,
            "requested_user_id": 1,
            "status": RequestStatus.pending,
            "media_id": 1,
            "media_type": MediaType.movies,
        },
        {
            "id": 4,
            "requesting_user_id": 1,
            "requested_user_id": 3,
            "status": RequestStatus.approved,
            "media_id": 1,
            "media_type": MediaType.movies,
        },
    ],
}
