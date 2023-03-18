from datetime import datetime
from pathlib import Path

from pydantic import AnyHttpUrl, EmailStr

from .base import APIModel, PaginatedResponse


class UserSchema(APIModel):
    username: str
    email: EmailStr | None
    id: int
    avatar: Path | AnyHttpUrl | None
    confirmed: bool
    roles: int
    created_at: datetime
    updated_at: datetime


class UserProfile(APIModel):
    username: str
    avatar: Path | AnyHttpUrl | None


class UserCreate(APIModel):
    username: str
    email: EmailStr | None
    password: str


class UserUpdate(APIModel):
    username: str | None
    email: EmailStr | None
    old_password: str | None
    password: str | None
    roles: int | None
    confirmed: bool | None


class UserSearchResponse(PaginatedResponse):
    items: list[UserProfile]


class PasswordResetCreate(APIModel):
    email: EmailStr


class PasswordResetConfirm(APIModel):
    password: str
