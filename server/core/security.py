from collections.abc import Sequence
from datetime import datetime, timedelta, timezone
from typing import Any, Literal

import jwt
from itsdangerous import BadSignature, URLSafeTimedSerializer
from passlib import pwd

from server.core.config import get_config
from server.schemas.auth import AccessTokenPayload


def create_jwt_access_token(payload: AccessTokenPayload, expires_delta: timedelta | None = None) -> str:
    to_encode = payload.dict()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=get_config().access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, get_config().secret_key, algorithm=get_config().signing_algorithm)


def get_random_password() -> str:
    return pwd.genword(entropy=56)


def generate_token(data: Any) -> str:
    serializer = URLSafeTimedSerializer(get_config().secret_key)
    return str(serializer.dumps(data))


def confirm_token(token: str) -> Any:
    serializer = URLSafeTimedSerializer(get_config().secret_key)
    try:
        data = serializer.loads(token, return_timestamp=True)
    except BadSignature:
        return None

    return data


async def check_permissions(user_roles: int, permissions: Sequence[int], options: Literal["and", "or"] = "and") -> bool:
    from server.models.users import UserRole

    if user_roles & UserRole.admin:
        return True
    if options == "and":
        return all(user_roles & permission for permission in permissions)
    if options == "or":
        return any(user_roles & permission for permission in permissions)
    return False
