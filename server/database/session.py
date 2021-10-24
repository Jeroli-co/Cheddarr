from typing import Optional

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import get_config


class EngineMaker:
    engine: Optional[AsyncEngine] = None

    @classmethod
    def get_engine(cls) -> AsyncEngine:
        if cls.engine is None:
            cls.engine = cls._create_engine()
        return cls.engine

    @classmethod
    def _create_engine(cls) -> AsyncEngine:
        return create_async_engine(get_config().db_url, connect_args={"check_same_thread": False})


Session = sessionmaker(EngineMaker.get_engine(), expire_on_commit=False, class_=AsyncSession)
