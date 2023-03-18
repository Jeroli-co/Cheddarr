import asyncio
from typing import AsyncGenerator

import jwt
import pytest
from async_asgi_testclient import TestClient
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from .utils import Dataset
from ..core.config import get_test_config


@pytest.fixture(scope="session")
def test_config():
    return get_test_config()


@pytest.fixture(scope="session")
def event_loop():
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def db_engine(event_loop, test_config):
    from server.database import Base

    engine = create_async_engine(test_config.db_uri, connect_args={"check_same_thread": False})
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await setup_database(conn)

    try:
        yield engine
    finally:
        await drop_database(test_config.db_uri)
        await engine.dispose()


@pytest.fixture()
async def db_session(db_engine):
    connection = await db_engine.connect()
    trans = await connection.begin()
    session = async_sessionmaker(connection, expire_on_commit=False)()

    try:
        yield session
    finally:
        await session.close()
        await trans.rollback()
        await connection.close()


async def setup_database(connection):
    async with async_sessionmaker(bind=connection, expire_on_commit=False)() as session:
        session.add_all(Dataset.users)
        session.add_all(Dataset.series)
        session.add_all(Dataset.movies)
        session.add_all(Dataset.series_requests)
        session.add_all(Dataset.movies_requests)
        await session.commit()


async def drop_database(uri):
    from server.database import Base

    engine = create_async_engine(uri, connect_args={"check_same_thread": False})

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


def app_v1() -> FastAPI:
    from server.api.v1.router import application as app_

    return app_


@pytest.fixture(scope="session")
def get_app():
    return {"v1": app_v1}


@pytest.fixture(params=["v1"], scope="function")
async def client(request, get_app, db_session) -> AsyncGenerator[TestClient, None]:
    from server.api.dependencies import get_db
    from server.core.config import get_config

    app_ = get_app[request.param]()
    app_.dependency_overrides[get_db] = lambda: (yield db_session)
    app_.dependency_overrides[get_config] = get_test_config

    async with TestClient(application=app_) as c:
        c.headers = {
            "Authorization": f"Bearer {jwt.encode({'sub':Dataset.users[0].id }, get_test_config().secret_key)}"
        }
        yield c


@pytest.fixture(scope="session", autouse=True)
def mock_config(session_mocker):
    session_mocker.patch("server.core.config.get_config", get_test_config)


@pytest.fixture(scope="function")
def mock_tmdb(mocker):
    from server.schemas.media import SeriesSchema, SeriesType

    def side_effect(id):
        if id == Dataset.series[0].tmdb_id:
            return SeriesSchema(**Dataset.series[0], number_of_seasons=7, series_type=SeriesType.anime)
        if id == Dataset.series[1].tmdb_id:
            return SeriesSchema(**Dataset.series[1], number_of_seasons=7, series_type=SeriesType.anime)

    mocker.patch("server.services.search.get_tmdb_series", side_effect=side_effect)
