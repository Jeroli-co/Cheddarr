from typing import Callable, Generator, Type

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from server.core import config

from server.models import User, UserRole
from server.repositories import PlexSettingRepository, UserRepository
from server.repositories.base import BaseRepository
from server.schemas import TokenPayload


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


def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.superuser:
        raise HTTPException(status_code=403, detail="Not enough privileges.")
    return current_user


def get_current_poweruser(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.superuser and current_user.role != UserRole.poweruser:
        raise HTTPException(status_code=403, detail="Not enough privileges.")
    return current_user


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
