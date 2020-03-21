from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

from server.auth import User


class UserSerializer(SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    first_name = auto_field()
    last_name = auto_field()
    username = auto_field()
    email = auto_field()
    user_picture = auto_field()
