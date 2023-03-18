from async_asgi_testclient import TestClient

from server.database.base import utcnow
from server.models.media import Media, MediaType
from server.models.requests import MovieRequest, RequestStatus, SeriesRequest
from server.models.users import User, UserRole


async def user_authentication_headers(*, client: TestClient, email: str, password: str) -> dict[str, str]:
    data = {"username": email, "password": password}
    r = await client.post("/sign-in", form=data)
    response = r.json()
    auth_token = response["access_token"]
    return {"Authorization": f"Bearer {auth_token}"}


class Dataset:
    users = [
        User(
            id=1,
            username="user1",
            email="user1@test.com",
            password="password1",
            avatar="/avatar.png",
            confirmed=True,
            roles=UserRole.admin,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
        User(
            id=2,
            username="user2",
            email="user2@test.com",
            password="password2",
            avatar="/avatar.png",
            confirmed=True,
            roles=UserRole.request,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
        User(
            id=3,
            username="user3",
            email="user3@test.com",
            password="password3",
            avatar="/avatar.png",
            confirmed=True,
            roles=UserRole.admin,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
        User(
            id=4,
            username="user4",
            email="user4@test.com",
            password="password4",
            avatar="/avatar.png",
            roles=UserRole.request,
            confirmed=False,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
    ]

    series = [
        Media(
            id=1,
            title="Star Wars: The Clone Wars",
            tmdb_id=4194,
            tvdb_id=83268,
            media_type=MediaType.series,
        ),
        Media(
            id=2,
            title="Star Wars Rebels",
            tmdb_id=60554,
            tvdb_id=283468,
            media_type=MediaType.series,
        ),
    ]

    series_requests = [
        SeriesRequest(
            id=1,
            requesting_user_id=3,
            status=RequestStatus.pending,
            media_id=1,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
        SeriesRequest(
            id=2,
            requesting_user_id=3,
            status=RequestStatus.pending,
            media_id=1,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
    ]

    movies = [
        Media(
            id=3,
            title="Star Wars: The Force Awakens",
            tmdb_id=140607,
            media_type=MediaType.movie,
        ),
        Media(
            id=4,
            title="Star Wars: The Last Jedi",
            tmdb_id=181808,
            media_type=MediaType.movie,
        ),
    ]

    movies_requests = [
        MovieRequest(
            id=3,
            requesting_user_id=3,
            status=RequestStatus.pending,
            media_id=3,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
        MovieRequest(
            id=4,
            requesting_user_id=3,
            status=RequestStatus.pending,
            media_id=3,
            created_at=utcnow(),
            updated_at=utcnow(),
        ),
    ]
