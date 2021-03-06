from typing import Callable, Generator, List, Literal, Type

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from server.core import config
from server.models.users import User, UserRole
from server.repositories.base import BaseRepository
from server.repositories.settings import PlexSettingRepository
from server.repositories.users import UserRepository
from server.schemas.auth import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="sign-in")


def get_db() -> Generator:
    from server.database.session import SessionLocal

    session = SessionLocal()
    try:
        yield session
    except Exception as exc:
        session.rollback()
        raise exc
    finally:
        session.close()


def get_repository(
    repo_type: Type[BaseRepository],
) -> Callable[[Session], BaseRepository]:
    def _get_repo(
        session: Session = Depends(get_db),
    ) -> BaseRepository:
        return repo_type(session)

    return _get_repo


def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repository: UserRepository = Depends(get_repository(UserRepository)),
) -> User:
    credentials_exception = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=config.SIGNING_ALGORITHM)
        token_data = TokenPayload.parse_obj(payload)
    except (jwt.JWTError, ValidationError):
        raise credentials_exception
    user = user_repository.find_by(id=int(token_data.sub))
    if not user:
        raise credentials_exception
    return user


def get_current_user_plex_settings(
    cur_user: User = Depends(get_current_user),
    plex_setting_repository: PlexSettingRepository = Depends(
        get_repository(PlexSettingRepository)
    ),
):
    settings = plex_setting_repository.find_all_by(user_id=cur_user.id, enabled=True)
    if settings is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex settings found for the user.")
    return settings


def has_user_permissions(
    permissions: List[UserRole], options: Literal["and", "or"] = "and"
) -> Callable[[User], None]:
    def _check_permissions(current_user: User = Depends(get_current_user)):
        has_permission = False

        if current_user.roles & UserRole.admin:
            has_permission = True
        elif options == "and":
            has_permission = all(current_user.roles & permission for permission in permissions)
        elif options == "or":
            has_permission = any(current_user.roles & permission for permission in permissions)

        if not has_permission:
            raise HTTPException(status_code=403, detail="Not enough privileges.")

    return _check_permissions
