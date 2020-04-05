from server import ma
from server.auth.models import User


class ProfileSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()
    email = ma.auto_field()


profile_serializer = ProfileSerializer()
profiles_serializer = ProfileSerializer(many=True)
