from __future__ import annotations

from typing import List, Optional

from pydantic import AnyHttpUrl, EmailStr

from . import APIModel


class UserBase(APIModel):
    username: Optional[str]
    email: Optional[EmailStr]


class User(UserBase):
    avatar: Optional[AnyHttpUrl]
    friends: List[UserPublic]
    confirmed: bool
    admin: bool


class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str


class UserUpdate(UserBase):
    old_password: Optional[str] = None
    password: Optional[str]


class UserPublic(UserBase):
    avatar: Optional[AnyHttpUrl]


class FriendshipCreate(APIModel):
    username_or_email: str


class PasswordResetCreate(APIModel):
    email: EmailStr


class PasswordResetConfirm(APIModel):
    password: str


User.update_forward_refs()
