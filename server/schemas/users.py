from datetime import datetime
from pathlib import Path
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr

from .core import APIModel, PaginatedResult


class UserBase(APIModel):
    username: str
    email: Optional[EmailStr]


class UserSchema(UserBase):
    id: int
    avatar: Optional[Union[Path, AnyHttpUrl]]
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
    confirmed: Optional[bool]


class UserSearchResult(PaginatedResult):
    results: List[UserSchema]
