from sqlalchemy import event
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    create_async_engine,
)

from server.core.config import get_config


class EngineMaker:
    engine: AsyncEngine | None = None

    @classmethod
    def get_async_engine(
        cls,
        uri: str = get_config().db_uri,
    ) -> AsyncEngine:
        if cls.engine is None:
            cls.engine = create_async_engine(uri, connect_args={"check_same_thread": False})

            @event.listens_for(cls.engine.sync_engine, "connect")
            def set_sqlite_pragma(dbapi_connection, connection_record) -> None:  # noqa
                cursor = dbapi_connection.cursor()
                cursor.execute("PRAGMA foreign_keys=ON")
                cursor.close()

        return cls.engine
