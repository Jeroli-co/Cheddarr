from typing import Callable, Iterator, List, Literal, Type

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.config import get_config
from server.models.users import User, UserRole
from server.repositories.base import BaseRepository
from server.repositories.users import UserRepository
from server.schemas.auth import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="sign-in")


async def get_db() -> Iterator[AsyncSession]:
    from server.database.session import DBSession

    session = DBSession.get_session()
    try:
        yield session
    except Exception as exc:
        await session.rollback()
        raise exc
    finally:
        await session.rollback()


def get_repository(
    repo_type: Type[BaseRepository],
) -> Callable[[AsyncSession], BaseRepository]:
    def _get_repo(
        session: AsyncSession = Depends(get_db),
    ) -> BaseRepository:
        return repo_type(session)

    return _get_repo


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repository: UserRepository = Depends(get_repository(UserRepository)),
) -> User:
    credentials_exception = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, get_config().secret_key, algorithms=get_config().signing_algorithm
        )
        token_data = TokenPayload.parse_obj(payload)
    except (jwt.InvalidTokenError, ValidationError):
        raise credentials_exception
    user = await user_repository.find_by(id=int(token_data.sub))
    if not user:
        raise credentials_exception
    return user


def has_user_permissions(
    permissions: List[UserRole], options: Literal["and", "or"] = "and"
) -> Callable[[User], None]:
    def _has_permissions(current_user: User = Depends(get_current_user)):
        from server.core.security import check_permissions

        if not check_permissions(current_user.roles, permissions, options):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges."
            )

    return _has_permissions
