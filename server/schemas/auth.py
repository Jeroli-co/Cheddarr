from __future__ import annotations

from pydantic import BaseModel, EmailStr, PositiveInt

from .base import APIModel


class AccessToken(BaseModel):
    access_token: str
    token_type: str


class AccessTokenPayload(BaseModel):
    sub: int


class EmailConfirm(APIModel):
    email: EmailStr
    old_email: EmailStr | None = None


class PlexAuthorizeSignin(APIModel):
    key: int
    code: str
    redirect_uri: str = ""
    user_id: int | None = None


class Invitation(APIModel):
    email: EmailStr | None = None
    max_uses: PositiveInt | None = None
    max_age: PositiveInt | None = None
