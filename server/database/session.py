from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.core.config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args=settings.DATABASE_OPTIONS, pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
