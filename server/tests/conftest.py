from typing import Dict

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.api import dependencies
from server.database.base import Base
from server.models.users import Friendship, User
from server.tests.utils import user_authentication_headers

user1_id = 1
user1_username = "user1"
user1_email = "email1@test.com"
user1_password = "password1"
user2_id = 2
user2_username = "user2"
user2_email = "email2@test.com"
user2_password = "password2"
user3_id = 3
user3_username = "user3"
user3_email = "email3@test.com"
user3_password = "password3"
user4_id = 4
user4_username = "user4"
user4_email = "email4@test.com"
user4_password = "password4"
avatar_url = "http://avatar.fake"

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
    app_.dependency_overrides[dependencies.db] = get_test_db
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
def datasets():
    Base.metadata.drop_all(_db_conn)
    Base.metadata.create_all(_db_conn)
    session = TestingSessionLocal()
    user1 = User(
        id=user1_id,
        username=user1_username,
        email=user1_email,
        password=user1_password,
        avatar=avatar_url,
        confirmed=True,
        admin=False,
    )
    user2 = User(
        id=user2_id,
        username=user2_username,
        email=user2_email,
        password=user2_password,
        avatar=avatar_url,
        confirmed=True,
        admin=False,
    )
    user3 = User(
        id=user3_id,
        username=user3_username,
        email=user3_email,
        password=user3_password,
        avatar=avatar_url,
        confirmed=True,
        admin=False,
    )
    user4 = User(
        id=user4_id,
        username=user4_username,
        email=user4_email,
        password=user4_password,
        avatar=avatar_url,
        confirmed=True,
        admin=False,
    )
    session.add_all((user1, user2, user3))
    friendship1 = Friendship(requesting_user=user1, receiving_user=user2, pending=False)
    friendship2 = Friendship(requesting_user=user1, receiving_user=user4, pending=True)
    session.add_all((friendship1, friendship2))
    session.commit()


@pytest.fixture
def normal_user_token_headers(client: TestClient) -> Dict[str, str]:
    return user_authentication_headers(
        client=client, email=user1_email, password=user1_password
    )
