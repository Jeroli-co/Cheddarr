from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import config

config.DB_FOLDER.mkdir(parents=True, exist_ok=True)
engine = create_async_engine(
    config.DB_URL, connect_args={"check_same_thread": False}, pool_pre_ping=True
)
Session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
