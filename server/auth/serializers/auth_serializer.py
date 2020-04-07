from server.auth.models import User
from server.extensions import ma


class SessionSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()


session_serializer = SessionSerializer()
