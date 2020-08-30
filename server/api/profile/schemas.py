from marshmallow import validate

from server.extensions import ma


class ChangePasswordSchema(ma.Schema):
    oldPassword = ma.String(required=True, validate=validate.Length(min=8))
    newPassword = ma.String(required=True, validate=validate.Length(min=8))


class UsernameOrEmailSchema(ma.Schema):
    usernameOrEmail = ma.String(required=True)
