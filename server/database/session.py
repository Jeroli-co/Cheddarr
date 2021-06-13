from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import config


class DBSession:
    engine: AsyncEngine = None

    @classmethod
    def get_engine(cls) -> AsyncEngine:
        if cls.engine is None:
            cls.engine = cls.create_engine()
        return cls.engine

    @classmethod
    def create_engine(cls) -> AsyncEngine:
        return create_async_engine(config.db_url, connect_args={"check_same_thread": False})

    @classmethod
    def create_sync_engine(cls) -> Engine:
        url = "sqlite:///" + str(config.db_folder / config.db_filename)
        return create_engine(url, connect_args={"check_same_thread": False})

    @classmethod
    def get_session(cls, new_engine: bool = False):
        engine = cls.get_engine()
        if new_engine:
            engine = cls.create_engine()
        return sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)()
