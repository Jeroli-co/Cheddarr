from server.extensions import ma


class SigninSchema(ma.Schema):
    usernameOrEmail = ma.String(required=True)
    password = ma.String(required=True)
    remember = ma.Boolean(required=False, missing=False)


class AuthorizePlexSigninSchema(ma.Schema):
    key = ma.Int()
    code = ma.String()
    redirectURI = ma.String(missing="")


class ConfirmPlexSigninSchema(ma.Schema):
    token = ma.String()
