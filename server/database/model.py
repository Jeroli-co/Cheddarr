from sqlalchemy import orm
from sqlalchemy.ext.declarative import declared_attr

from server.extensions import db


class BaseModel(db.Model):
    """Base Model class. It includes convenience methods for creating,
    querying, saving, updating and deleting models.
    """

    __abstract__ = True
    __repr_props__ = ()

    def save(self):
        db.session.add(self)
        return db.session.commit()

    def delete(self):
        db.session.delete(self)
        return db.session.commit()

    def update(self, data):
        data = data.__dict__ if isinstance(data, self.__class__) else data
        for field, value in data.items():
            if hasattr(self, field) and not field.startswith("_"):
                setattr(self, field, value)
        return self.save()

    @classmethod
    def find(cls, **filters):
        return db.session.query(cls).filter_by(**filters).one_or_none()

    @classmethod
    def findAll(cls, **filters):
        return db.session.query(cls).filter_by(**filters).all()

    @classmethod
    def exists(cls, **filters):
        return db.session.query(cls.id).filter_by(**filters).scalar()

    @classmethod
    def search(cls, field: str, value, limit=3):
        return cls.query.filter(getattr(cls, field).contains(value)).limit(limit).all()

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

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()


session: orm.session.Session = db.session
