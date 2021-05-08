from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import config

engine = create_async_engine(config.DB_URL, connect_args={"check_same_thread": False})
Session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


def get_db_session(new_engine: bool = False):
    engine_ = engine
    if new_engine:
        engine_ = create_async_engine(config.DB_URL, connect_args={"check_same_thread": False})
    return sessionmaker(engine_, expire_on_commit=False, class_=AsyncSession)
