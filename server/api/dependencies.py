from typing import Callable, Generator, Type

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from server.core.config import settings
from server.database.session import SessionLocal
from server.models import User
from server.repositories import PlexConfigRepository, UserRepository
from server.repositories.base import BaseRepository
from server.schemas import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/sign-in")


def _db() -> Generator:
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
        session: Session = Depends(_db),
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
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=settings.SIGNING_ALGORITHM
        )
        token_data = TokenPayload.parse_obj(payload)
    except (jwt.JWTError, ValidationError):
        raise credentials_exception
    user = user_repository.find_by(id=int(token_data.sub))
    if not user:
        raise credentials_exception
    return user


def get_current_user_plex_configs(
    cur_user: User = Depends(get_current_user),
    plex_config_repository: PlexConfigRepository = Depends(
        get_repository(PlexConfigRepository)
    ),
):
    configs = plex_config_repository.find_all_by(user_id=cur_user.id, enabled=True)
    if configs is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No Plex configuration found for the user."
        )
    return configs
