from server.auth.models import User
from server.extensions import ma


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

    user_picture = ma.Field()


class SigninSchema(ma.Schema):
    usernameOrEmail = ma.String(required=True)
    password = ma.String(required=True)
    remember = ma.Boolean(required=False, missing=False)


class PlexAuthSchema(ma.Schema):
    redirectURI = ma.String(missing="")
    token = ma.String()
