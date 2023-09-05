from __future__ import annotations

from datetime import datetime
from typing import Annotated

from pydantic import BeforeValidator, EmailStr, SecretStr, field_serializer

from server.core.config import get_config

from .base import APIModel

UserAvatar = Annotated[
    str | None,
    BeforeValidator(lambda v: f"{get_config().server_host}{v}" if v.startswith("/images") else v),
]


class UserSchema(APIModel):
    username: str
    email: EmailStr | None = None
    id: int
    avatar: UserAvatar = None
    confirmed: bool
    roles: int
    created_at: datetime
    updated_at: datetime


class UserProfile(APIModel):
    username: str
    avatar: UserAvatar = None


class UserCreate(APIModel):
    username: str
    email: EmailStr | None = None
    password: SecretStr

    @field_serializer("password")
    def dump_secret(self, v: SecretStr) -> str:
        return v.get_secret_value()


class UserUpdate(APIModel):
    username: str | None = None
    email: EmailStr | None = None
    old_password: SecretStr | None = None
    password: SecretStr | None = None
    roles: int | None = None
    confirmed: bool | None = None


class UserLogin(APIModel):
    username: str
    password: SecretStr


class PasswordResetCreate(APIModel):
    email: EmailStr


class PasswordResetConfirm(APIModel):
    password: SecretStr
