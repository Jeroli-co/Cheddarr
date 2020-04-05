from server import ma
from server.auth.models import User


class SessionSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()


session_serializer = SessionSerializer()
