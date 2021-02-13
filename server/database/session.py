from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import config

engine = create_engine(
    config.DATABASE_URL,
    connect_args=config.DATABASE_OPTIONS,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
