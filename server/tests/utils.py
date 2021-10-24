from typing import Dict

from httpx import AsyncClient

from server.models.media import MediaType
from server.models.requests import RequestStatus
from server.models.users import UserRole


async def user_authentication_headers(
    *, client: AsyncClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}
    r = await client.post("/sign-in", data=data)
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
            "avatar": "/avatar.png",
            "confirmed": True,
            "roles": UserRole.admin,
        },
        {
            "id": 2,
            "username": "user2",
            "email": "email2@test.com",
            "password": "password2",
            "avatar": "/avatar.png",
            "confirmed": True,
            "roles": UserRole.request,
        },
        {
            "id": 3,
            "username": "user3",
            "email": "email3@test.com",
            "password": "password3",
            "avatar": "/avatar.png",
            "confirmed": True,
            "roles": UserRole.request,
        },
    ],
    "series": [
        {
            "id": 1,
            "title": "Star Wars: The Clone Wars",
            "tmdb_id": 4194,
            "tvdb_id": 83268,
            "media_type": MediaType.series,
        },
        {
            "id": 2,
            "title": "Star Wars Rebels",
            "tmdb_id": 60554,
            "tvdb_id": 283468,
            "media_type": MediaType.series,
        },
    ],
    "series_requests": [
        {
            "id": 1,
            "requesting_user_id": 3,
            "status": RequestStatus.pending,
            "media_id": 1,
            "media_type": MediaType.series,
        },
        {
            "id": 2,
            "requesting_user_id": 1,
            "status": RequestStatus.approved,
            "media_id": 1,
            "media_type": MediaType.series,
        },
    ],
    "movies": [
        {
            "id": 3,
            "title": "Star Wars",
            "tmdb_id": 11,
            "media_type": MediaType.movie,
        },
        {
            "id": 4,
            "title": "Star Trek",
            "tmdb_id": 13475,
            "media_type": MediaType.movie,
        },
    ],
    "movies_requests": [
        {
            "id": 3,
            "requesting_user_id": 3,
            "status": RequestStatus.pending,
            "media_id": 2,
            "media_type": MediaType.movie,
        },
        {
            "id": 4,
            "requesting_user_id": 1,
            "status": RequestStatus.approved,
            "media_id": 2,
            "media_type": MediaType.movie,
        },
    ],
}
