# Import all the models, so that Base has them fot creating the tables
from server import models  # noqa
from .base import Base


async def init_db(debug: bool = False) -> None:
    from server.database.engine import EngineMaker

    async with EngineMaker.get_async_engine(debug=debug).begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
