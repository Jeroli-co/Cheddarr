from typing import Optional

from pydantic import BaseModel, EmailStr
from .base import APIModel


class Token(APIModel):
    access_token: str
    token_type: str


class TokenPayload(APIModel):
    sub: str
    username: str
    avatar: str
    admin: bool = False


class EmailConfirm(APIModel):
    email: EmailStr
    old_email: Optional[EmailStr]


class PlexAuthorizeSignin(APIModel):
    key: str
    code: str
    redirect_uri: str = ""
