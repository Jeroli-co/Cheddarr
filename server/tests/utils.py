from datetime import datetime
from typing import Dict

from fastapi.testclient import TestClient

from server.core.config import settings


def user_authentication_headers(
    *, client: TestClient, api_version: int, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}
    r = client.post(f"{settings.API_PREFIX}/v{api_version}/sign-in", data=data)
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
            "release_date": datetime.strptime("2008-10-03", "%Y-%m-%d"),
            "status": "Ended",
            "poster_url": "https://image.tmdb.org/t/p/w500//e1nWfnnCVqxS2LeTO3dwGyAsG2V.jpg",
            "art_url": "https://image.tmdb.org/t/p/w1280//m6eRgkR1KC6Mr6gKx6gKCzSn6vD.jpg",
            "tvdb_id": 83268,
            "number_of_seasons": 7,
            "series_type": "anime",
        }
    ],
    "series_requests": [
        {
            "id": 1,
            "requesting_user_id": 3,
            "requested_user_id": 1,
            "status": "pending",
            "series_id": 1,
        },
        {
            "id": 2,
            "requesting_user_id": 1,
            "requested_user_id": 3,
            "status": "approved",
            "series_id": 1,
        },
    ],
    "movies": [
        {
            "id": 1,
            "title": "Star Wars: The Clone Wars",
            "release_date": datetime.strptime("1977-10-18", "%Y-%m-%d"),
            "status": "Ended",
            "poster_url": "https://image.tmdb.org/t/p/w500//e1nWfnnCVqxS2LeTO3dwGyAsG2V.jpg",
            "art_url": "https://image.tmdb.org/t/p/w1280//m6eRgkR1KC6Mr6gKx6gKCzSn6vD.jpg",
            "tmdb_id": 11,
        }
    ],
    "movies_requests": [
        {
            "id": 1,
            "requesting_user_id": 3,
            "requested_user_id": 1,
            "status": "pending",
            "movie_id": 1,
        },
        {
            "id": 2,
            "requesting_user_id": 1,
            "requested_user_id": 3,
            "status": "approved",
            "movie_id": 1,
        },
    ],
}
