from pydantic import BaseModel, EmailStr, PositiveInt

from .base import APIModel


class AccessToken(BaseModel):
    access_token: str
    token_type: str


class AccessTokenPayload(BaseModel):
    sub: str


class EmailConfirm(APIModel):
    email: EmailStr
    old_email: EmailStr | None


class PlexAuthorizeSignin(APIModel):
    key: str
    code: str
    redirect_uri: str = ""
    user_id: int | None


class Invitation(APIModel):
    email: EmailStr | None
    max_uses: PositiveInt | None
    max_age: PositiveInt | None
