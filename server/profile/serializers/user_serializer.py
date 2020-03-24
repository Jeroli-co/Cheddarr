from server import ma
from server.auth.models import User


class UserSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()


class ProfileSerializer(UserSerializer):
    email = ma.auto_field()
