from collections.abc import AsyncGenerator, Callable, Sequence
from typing import Annotated, Literal

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.config import Config, get_config
from server.models.base import ModelType
from server.models.users import User, UserRole
from server.repositories.base import BaseRepository
from server.repositories.users import UserRepository
from server.schemas.auth import AccessTokenPayload
from server.services.base import BaseService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="sign-in")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    from server.database.session import Session

    async with Session() as session:
        try:
            yield session
        except Exception as exc:
            await session.rollback()
            raise exc from None


def get_repository(
    repo_type: type[BaseRepository[ModelType]],
) -> Callable[[AsyncSession], BaseRepository[ModelType]]:
    def _get_repo(
        session: AsyncSession = Depends(get_db),
    ) -> BaseRepository[ModelType]:
        return repo_type(session)

    return _get_repo


def get_service(service_type: type[BaseService]) -> Callable[[], BaseService]:
    def _get_service(session: AsyncSession = Depends(get_db)) -> BaseService:
        deps = [
            get_service(dep)() if issubclass(dep, BaseService) else get_repository(dep)(session)
            for dep in service_type.get_dependencies()
        ]

        return service_type(*deps)

    return _get_service


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
        payload = jwt.decode(token, get_config().secret_key, algorithms=[get_config().signing_algorithm])
        token_data = AccessTokenPayload.model_validate(payload)
    except (jwt.InvalidTokenError, ValidationError):
        raise credentials_exception
    user = await user_repository.find_by(id=token_data.sub, confirmed=True).one()
    if user is None:
        raise credentials_exception

    return user


def has_user_permissions(
    permissions: Sequence[UserRole],
    options: Literal["and", "or"] = "and",
) -> Callable[[User], None]:
    def _has_permissions(current_user: User = Depends(get_current_user)) -> None:
        from server.core.security import check_permissions

        if not check_permissions(current_user.roles, permissions, options):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges.")

    return _has_permissions


AppConfig = Annotated[Config, Depends(get_config)]
CurrentUser = Annotated[User, Depends(get_current_user)]
