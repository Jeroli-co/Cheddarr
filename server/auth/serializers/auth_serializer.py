from server import ma
from server.auth.models import User, ApiKey


class SessionSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()


class ApiKeySerializer(ma.SQLAlchemySchema):
    class Meta:
        model = ApiKey

    key = ma.auto_field()


session_serializer = SessionSerializer()
api_key_serializer = ApiKeySerializer()
