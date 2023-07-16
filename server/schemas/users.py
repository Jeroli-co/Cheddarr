from __future__ import annotations

from datetime import datetime
from pathlib import Path

from pydantic import AnyHttpUrl, EmailStr

from .base import APIModel


class UserSchema(APIModel):
    username: str
    email: EmailStr | None = None
    id: int
    avatar: Path | AnyHttpUrl | None = None
    confirmed: bool
    roles: int
    created_at: datetime
    updated_at: datetime


class UserProfile(APIModel):
    username: str
    avatar: Path | AnyHttpUrl | None = None


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
