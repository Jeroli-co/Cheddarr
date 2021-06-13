# Import all the models, so that Base has them fot creating the tables
from server import models  # noqa
from .base import Base


def init_db():
    from server.database.session import DBSession

    with DBSession.create_sync_engine().begin() as conn:
        Base.metadata.drop_all(bind=conn)
        Base.metadata.create_all(bind=conn)
