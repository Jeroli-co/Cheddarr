import os
from typing import Dict

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.api.dependencies import get_db
from .utils import datasets, user_authentication_headers

url = "sqlite://"
_db_conn = create_engine(url, connect_args={"check_same_thread": False}, poolclass=StaticPool)
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


def app_v1() -> FastAPI:
    from server.api.v1.router import application as app_

    app_.dependency_overrides[get_db] = get_test_db
    return app_


@pytest.fixture(scope="module")
def get_app():
    return {"v1": app_v1}


@pytest.fixture(scope="module", params=["v1"])
def client(request, get_app):
    with TestClient(get_app[request.param]()) as c:
        yield c


@pytest.fixture(scope="function")
def db():
    session = TestingSessionLocal()
    yield session
    session.rollback()


@pytest.fixture(scope="function", autouse=True)
def setup():
    from server.database.base import Base
    from server.models import (
        Media,
        MovieRequest,
        SeriesRequest,
        Friendship,
        User,
    )

    Base.metadata.drop_all(_db_conn)
    Base.metadata.create_all(_db_conn)
    session = TestingSessionLocal()
    user1 = User(**datasets["users"][0])
    user2 = User(**datasets["users"][1])
    user3 = User(**datasets["users"][2])
    user4 = User(**datasets["users"][3])
    session.add_all((user1, user2, user3))
    friendship1 = Friendship(requesting_user=user1, requested_user=user2, pending=False)
    friendship2 = Friendship(requesting_user=user1, requested_user=user4, pending=True)
    session.add_all((friendship1, friendship2))
    series1 = Media(**datasets["series"][0])
    movie1 = Media(**datasets["movies"][0])
    session.add_all((movie1, series1))
    series_request1 = SeriesRequest(**datasets["series_requests"][0])
    series_request2 = SeriesRequest(**datasets["series_requests"][1])
    movie_request1 = MovieRequest(**datasets["movies_requests"][0])
    movie_request2 = MovieRequest(**datasets["movies_requests"][1])
    session.add_all((series_request1, series_request2, movie_request1, movie_request2))
    session.commit()


@pytest.fixture
def normal_user_token_headers(client: TestClient) -> Dict[str, str]:
    return user_authentication_headers(
        client=client,
        email=datasets["users"][0]["email"],
        password=datasets["users"][0]["password"],
    )


@pytest.fixture(scope="function")
def mock_tmdb(mocker):
    series = datasets["series"][0]
    series["number_of_seasons"] = 7
    series["series_type"] = "anime"
    mocker.patch(
        "server.helpers.search.get_tmdb_series",
        return_value=series,
    )
