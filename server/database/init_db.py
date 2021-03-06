# Import all the models, so that Base has them fot creating the tables
from server import models  # noqa
from .base import Base


def init_db():
    from server.database.session import engine

    Base.metadata.reflect(bind=engine)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
