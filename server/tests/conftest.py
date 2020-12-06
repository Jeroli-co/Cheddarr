from typing import Dict

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.api.dependencies import _db
from server.database.base import Base
from server.models.users import Friendship, User
from server.tests.utils import user_authentication_headers

datasets = {
    "user1": {
        "id": 1,
        "username": "user1",
        "email": "email1@test.com",
        "password": "password1",
        "avatar": "http://avatar.fake",
        "confirmed": True,
    },
    "user2": {
        "id": 2,
        "username": "user2",
        "email": "email2@test.com",
        "password": "password2",
        "avatar": "http://avatar.fake",
        "confirmed": True,
    },
    "user3": {
        "id": 3,
        "username": "user3",
        "email": "email3@test.com",
        "password": "password3",
        "avatar": "http://avatar.fake",
        "confirmed": True,
    },
    "user4": {
        "id": 4,
        "username": "user4",
        "email": "email4@test.com",
        "password": "password4",
        "avatar": "http://avatar.fake",
        "confirmed": False,
    },
    "series": {
        "title": "Star Wars: The Clone Wars",
        "releaseDate": "2008-10-03",
        "status": "Ended",
        "posterUrl": "https://image.tmdb.org/t/p/w500//e1nWfnnCVqxS2LeTO3dwGyAsG2V.jpg",
        "artUrl": "https://image.tmdb.org/t/p/w1280//m6eRgkR1KC6Mr6gKx6gKCzSn6vD.jpg",
        "tvdbId": 83268,
        "numberOfSeasons": 7,
        "seasons": None,
        "mediaType": "series",
        "seriesType": "anime",
    },
}


url = "sqlite://"
_db_conn = create_engine(
    url, connect_args={"check_same_thread": False}, poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=_db_conn, expire_on_commit=False
)


# Override dependency
def get_test_db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(scope="module")
def app() -> FastAPI:
    from server.main import setup_app  # local import for testing purpose

    app_ = setup_app()
    app_.dependency_overrides[_db] = get_test_db
    return app_


@pytest.fixture(scope="module")
def client(app: FastAPI):
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function")
def db():
    session = TestingSessionLocal()
    yield session
    session.rollback()


@pytest.fixture(scope="function", autouse=True)
def setup():
    Base.metadata.drop_all(_db_conn)
    Base.metadata.create_all(_db_conn)
    session = TestingSessionLocal()
    user1 = User(**datasets["user1"])
    user2 = User(**datasets["user2"])
    user3 = User(**datasets["user3"])
    user4 = User(**datasets["user4"])
    session.add_all((user1, user2, user3))
    friendship1 = Friendship(requesting_user=user1, requested_user=user2, pending=False)
    friendship2 = Friendship(requesting_user=user1, requested_user=user4, pending=True)
    session.add_all((friendship1, friendship2))
    session.commit()


@pytest.fixture
def normal_user_token_headers(client: TestClient) -> Dict[str, str]:
    return user_authentication_headers(
        client=client,
        email=datasets["user1"]["email"],
        password=datasets["user1"]["password"],
    )


@pytest.fixture(scope="function")
def mock_tmdb(mocker):
    mocker.patch(
        "server.helpers.search.find_tmdb_series_by_tvdb_id",
        return_value=datasets["series"],
    )
