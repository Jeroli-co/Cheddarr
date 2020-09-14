from server.extensions import ma

from .models import User


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        exclude = ("session_token",)

    friends = ma.Nested(
        lambda: UserSchema(only=("username", "avatar", "email", "_links")), many=True
    )
    _links = ma.Hyperlinks(
        {
            "self": ma.AbsoluteURLFor("users.get_user", username="<username>"),
        }
    )


profile_serializer = UserSchema(only=["username", "avatar", "email", "_links"])
user_serializer = UserSchema(exclude=["password", "api_key"])
