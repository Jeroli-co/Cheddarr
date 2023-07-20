from async_asgi_testclient import TestClient

from server.models.media import Media, MediaType
from server.models.requests import MediaRequest, RequestStatus
from server.models.users import Token, User, UserRole


async def user_authentication_headers(*, client: TestClient, email: str, password: str) -> dict[str, str]:
    data = {"username": email, "password": password}
    r = await client.post("/sign-in", form=data)
    response = r.json()
    auth_token = response["access_token"]
    return {"Authorization": f"Bearer {auth_token}"}


class Dataset:
    users = [
        User(
            username="user1",
            email="user1@test.com",
            password="password1",
            avatar="/avatar.png",
            confirmed=True,
            roles=UserRole.admin,
        ),
        User(
            username="user2",
            email="user2@test.com",
            password="password2",
            avatar="/avatar.png",
            confirmed=True,
            roles=UserRole.request,
        ),
        User(
            username="user3",
            email="user3@test.com",
            password="password3",
            avatar="/avatar.png",
            confirmed=True,
            roles=UserRole.admin,
        ),
        User(
            username="user4",
            email="user4@test.com",
            password="password4",
            avatar="/avatar.png",
            roles=UserRole.request,
            confirmed=False,
        ),
    ]

    invitations = [
        Token(data={"email": "email@test.com"}),
    ]

    series = [
        Media(
            title="Star Wars: The Clone Wars",
            tmdb_id=4194,
            tvdb_id=83268,
            imdb_id="tt0458290",
            media_type=MediaType.series,
        ),
        Media(
            title="Star Wars: Rebels",
            tmdb_id=60554,
            tvdb_id=283468,
            imdb_id="tt2930604",
            media_type=MediaType.series,
        ),
    ]

    series_requests = [
        MediaRequest(
            media_type=MediaType.series,
            requesting_user_id=3,
            status=RequestStatus.pending,
            media_id=1,
        ),
        MediaRequest(
            media_type=MediaType.series,
            requesting_user_id=1,
            status=RequestStatus.pending,
            media_id=1,
        ),
    ]

    movies = [
        Media(
            title="Star Wars: The Force Awakens",
            tmdb_id=140607,
            imdb_id="tt2488496",
            tvdb_id=None,
            media_type=MediaType.movie,
        ),
        Media(
            title="Star Wars: The Last Jedi",
            tmdb_id=181808,
            imdb_id="tt2527336",
            tvdb_id=None,
            media_type=MediaType.movie,
        ),
    ]

    movies_requests = [
        MediaRequest(
            media_type=MediaType.movie,
            requesting_user_id=3,
            status=RequestStatus.pending,
            media_id=3,
        ),
        MediaRequest(
            media_type=MediaType.movie,
            requesting_user_id=1,
            status=RequestStatus.pending,
            media_id=3,
        ),
    ]
