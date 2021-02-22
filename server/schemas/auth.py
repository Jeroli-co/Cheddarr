from typing import Optional

from pydantic import BaseModel, EmailStr

from .base import APIModel
from ..models import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str
    username: str
    avatar: str
    role: UserRole


class EmailConfirm(APIModel):
    email: EmailStr
    old_email: Optional[EmailStr]


class PlexAuthorizeSignin(APIModel):
    key: str
    code: str
    redirect_uri: str = ""
