from datetime import datetime, timedelta
from typing import Literal

import jwt
from itsdangerous import URLSafeSerializer, URLSafeTimedSerializer
from passlib import pwd
from passlib.context import CryptContext

from server.core.config import config
from server.schemas.auth import TokenPayload

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_jwt_access_token(payload: TokenPayload, expires_delta: timedelta = None) -> str:
    to_encode = payload.dict()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.secret_key, algorithm=config.signing_algorithm)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def get_random_password() -> str:
    return pwd.genword(entropy=56)


def generate_token(data):
    serializer = URLSafeSerializer(config.secret_key)
    return serializer.dumps(data)


def confirm_token(data):
    serializer = URLSafeSerializer(config.secret_key)
    return serializer.loads(data)


def generate_timed_token(data):
    serializer = URLSafeTimedSerializer(config.secret_key)
    return serializer.dumps(data)


def confirm_timed_token(token: str, expiration_minutes: int = 30):
    serializer = URLSafeTimedSerializer(config.secret_key)
    try:
        data = serializer.loads(token, max_age=expiration_minutes * 60)
    except Exception:
        raise Exception
    return data


def check_permissions(
    user_roles: int, permissions: list, options: Literal["and", "or"] = "and"
) -> bool:
    from server.models.users import UserRole

    if user_roles & UserRole.admin:
        return True
    elif options == "and":
        return all(user_roles & permission for permission in permissions)
    elif options == "or":
        return any(user_roles & permission for permission in permissions)
    return False
