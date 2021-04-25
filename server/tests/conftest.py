from typing import Iterator

import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from server.api.dependencies import get_db
from .utils import datasets, user_authentication_headers

url = "sqlite+aiosqlite://"
_db_conn = create_async_engine(url, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(_db_conn, expire_on_commit=False, class_=AsyncSession)


# Override dependency and db fixture
async def get_test_db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        await session.close()


db = pytest.fixture(get_test_db, scope="function")


def app_v1() -> FastAPI:
    from server.api.v1.router import application as app_

    app_.dependency_overrides[get_db] = get_test_db
    return app_


@pytest.fixture(scope="module")
def get_app():
    return {"v1": app_v1}


@pytest.fixture(scope="function", autouse=True)
async def setup(db):

    from server.models.media import Media
    from server.models.requests import MovieRequest, SeriesRequest
    from server.models.users import User
    from server.database import Base

    async with _db_conn.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    user1 = User(**datasets["users"][0])
    user2 = User(**datasets["users"][1])
    user3 = User(**datasets["users"][2])
    user4 = User(**datasets["users"][3])
    db.add_all((user1, user2, user3))
    series1 = Media(**datasets["series"][0])
    movie1 = Media(**datasets["movies"][0])
    db.add_all((movie1, series1))
    series_request1 = SeriesRequest(**datasets["series_requests"][0])
    series_request2 = SeriesRequest(**datasets["series_requests"][1])
    movie_request1 = MovieRequest(**datasets["movies_requests"][0])
    movie_request2 = MovieRequest(**datasets["movies_requests"][1])
    db.add_all((series_request1, series_request2, movie_request1, movie_request2))
    await db.commit()


@pytest.fixture(params=["v1"])
async def client(request, get_app) -> Iterator[AsyncClient]:
    app_ = get_app[request.param]()
    async with AsyncClient(app=app_, base_url="http://test") as c:
        c.headers = await user_authentication_headers(
            client=c,
            email=datasets["users"][0]["email"],
            password=datasets["users"][0]["password"],
        )
        setattr(c, "app", app_)
        yield c


@pytest.fixture(scope="function")
def mock_tmdb(mocker):
    series = datasets["series"][0]
    series["number_of_seasons"] = 7
    series["series_type"] = "anime"
    mocker.patch(
        "server.services.search.get_tmdb_series",
        return_value=series,
    )
