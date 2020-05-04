from server.auth.models import User
from server.extensions import ma


class ProfileSerializer(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = ma.auto_field()
    user_picture = ma.auto_field()
    email = ma.auto_field()


profiles_serializer = ProfileSerializer()
