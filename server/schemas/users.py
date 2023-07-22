from __future__ import annotations

from datetime import datetime
from typing import Annotated

from pydantic import AnyHttpUrl, BeforeValidator, EmailStr

from .base import APIModel
from server.core.config import get_config

UserAvatar = Annotated[
    AnyHttpUrl | None, BeforeValidator(lambda v: f"{get_config().server_host}{v}" if v.startswith("/images") else v)
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
    password: str


class UserUpdate(APIModel):
    username: str | None = None
    email: EmailStr | None = None
    old_password: str | None = None
    password: str | None = None
    roles: int | None = None
    confirmed: bool | None = None


class PasswordResetCreate(APIModel):
    email: EmailStr


class PasswordResetConfirm(APIModel):
    password: str
