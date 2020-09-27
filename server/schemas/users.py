from marshmallow.validate import OneOf

from server.extensions import ma
from server.models.users import User


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


class ChangePasswordSchema(ma.Schema):
    oldPassword = ma.String(required=True)
    newPassword = ma.String(required=True)


class AddFriendSchema(ma.Schema):
    usernameOrEmail = ma.String(required=True)


class GetFriendProvidersSchema(ma.Schema):
    type = ma.String(validate=OneOf(["movies", "series"]))
