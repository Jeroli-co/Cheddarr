from marshmallow_sqlalchemy.schema.sqlalchemy_schema import auto_field
from server.api.auth.models import User
from server.extensions import ma


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    username = auto_field()
    email = auto_field()
    password = auto_field()
    avatar = auto_field()


class SigninSchema(ma.Schema):
    usernameOrEmail = ma.String(required=True)
    password = ma.String(required=True)
    remember = ma.Boolean(required=False, missing=False)


class PlexAuthSchema(ma.Schema):
    key = ma.Int()
    code = ma.String()
    redirectURI = ma.String(missing="")


class PlexConfirmSigninSchema(ma.Schema):
    token = ma.String()
