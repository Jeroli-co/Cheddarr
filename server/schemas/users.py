from datetime import datetime
from typing import List, Optional

from pydantic import AnyHttpUrl, EmailStr

from .core import APIModel, PaginatedResult


class UserBase(APIModel):
    username: str
    email: Optional[EmailStr]


class UserSchema(UserBase):
    id: int
    avatar: Optional[AnyHttpUrl]
    confirmed: bool
    roles: int
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    username: Optional[str]
    email: Optional[EmailStr]
    old_password: Optional[str]
    password: Optional[str]
    roles: Optional[int]


class UserSearchResult(PaginatedResult):
    results: List[UserSchema]


class PasswordResetCreate(APIModel):
    email: EmailStr


class PasswordResetConfirm(APIModel):
    password: str
