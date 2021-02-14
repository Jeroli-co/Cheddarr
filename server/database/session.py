from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import config

config.DB_FOLDER.mkdir(parents=True, exist_ok=True)
engine = create_engine(
    config.DB_URL,
    connect_args=config.DB_OPTIONS,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
