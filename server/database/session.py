from sqlalchemy.ext.asyncio import async_sessionmaker

from server.database.engine import EngineMaker

Session = async_sessionmaker(EngineMaker.get_async_engine(), expire_on_commit=False)
