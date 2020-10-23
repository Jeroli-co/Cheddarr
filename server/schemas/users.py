from typing import Optional

from pydantic import AnyHttpUrl, EmailStr
from . import APIModel


class UserBase(APIModel):
    username: str
    email: EmailStr


class User(UserBase):
    avatar: Optional[AnyHttpUrl]
    confirmed: bool
    admin: bool


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    username: Optional[str]
    email: Optional[EmailStr]
    old_password: Optional[str]
    password: Optional[str]


class UserPublic(UserBase):
    avatar: Optional[AnyHttpUrl]


class FriendshipCreate(APIModel):
    username_or_email: str


class PasswordResetCreate(APIModel):
    email: EmailStr


class PasswordResetConfirm(APIModel):
    password: str
