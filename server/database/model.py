from server.extensions.sqlalchemy import db
from sqlalchemy import orm
from sqlalchemy.ext.declarative import declared_attr


class BaseModel(db.Model):
    """Base Model class. It includes convenience methods for creating,
    querying, saving, updating and deleting models.
    """

    __abstract__ = True
    __table_args__ = {"extend_existing": True}
    __repr_props__ = ()

    def save(self):
        db.session.add(self)
        return db.session.commit()

    def delete(self):
        db.session.delete(self)
        return db.session.commit()

    @classmethod
    def find(cls, **filters):
        return cls.query.filter_by(**filters).one_or_none()

    @classmethod
    def findAll(cls, **filters):
        return cls.query.filter_by(**filters).all()

    @classmethod
    def exists(cls, **filters):
        return db.session.query(cls.id).filter_by(**filters).scalar()

    def __repr__(self):
        properties = [
            f"{prop}={getattr(self, prop)!r}"
            for prop in self.__repr_props__
            if hasattr(self, prop)
        ]
        return f"<{self.__class__.__name__} {' '.join(properties)}>"


class Model(BaseModel):
    """Base table class that extends :class:`server.database.model.BaseModel` and
    includes a primary key :attr:`id` field .
    """

    __abstract__ = True

    def __repr__(self):
        properties = [
            f"{prop}={getattr(self, prop)!r}"
            for prop in self.__repr_props__
            if hasattr(self, prop)
        ]
        return f"<{self.__class__.__name__} {' '.join(properties)}>"

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()


session = db.session  # type: orm.session.Session
