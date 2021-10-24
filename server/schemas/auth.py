from typing import Optional

from pydantic import BaseModel, EmailStr, PositiveInt

from .core import APIModel


class AccessToken(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str


class EmailConfirm(APIModel):
    email: EmailStr
    old_email: Optional[EmailStr]


class PlexAuthorizeSignin(APIModel):
    key: str
    code: str
    redirect_uri: str = ""
    user_id: Optional[int]


class Invitation(APIModel):
    email: Optional[EmailStr]
    max_uses: Optional[PositiveInt]
