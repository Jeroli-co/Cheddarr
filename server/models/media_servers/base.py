from sqlalchemy.ext.declarative import declared_attr, AbstractConcreteBase

from server.database import (
    Model,
    Column,
    ForeignKey,
    String,
    relationship,
    Integer,
)


class MediaServer(Model, AbstractConcreteBase):
    id = Column(Integer, primary_key=True)
    api_key = Column(String(256))

    @declared_attr
    def user_id(cls):
        return Column(ForeignKey("user.id"))

    @declared_attr
    def user(cls):
        return relationship("User", back_populates="media_servers")

    @declared_attr
    def __mapper_args__(cls):
        if cls == MediaServer:
            return {"concrete": False}
        return {"polymorphic_identity": cls.__name__, "concrete": True}

    __repr_props__ = ("name", "user")
