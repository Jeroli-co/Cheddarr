from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

from server.auth import User


class SessionSerializer(SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    username = auto_field()
