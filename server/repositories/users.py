from __future__ import annotations

import sqlalchemy as sa

from server.models.users import Token, User

from .base import BaseRepository, Select


class UserRepository(BaseRepository[User]):
    """Repository for User model."""

    def find_by_email(self, email: str) -> Select[User]:
        statement = sa.select(self.model).where(sa.func.lower(self.model.email) == email.lower())
        return self.select(statement)

    def find_by_username(self, username: str) -> Select[User]:
        statement = sa.select(self.model).where(sa.func.lower(self.model.username) == username.lower())
        return self.select(statement)

    def find_by_username_or_email(self, username_or_email: str) -> Select[User]:
        statement = sa.select(self.model).where(
            (sa.func.lower(self.model.email) == username_or_email.lower())
            | (sa.func.lower(self.model.username) == username_or_email.lower()),
        )
        return self.select(statement)


class TokenRepository(BaseRepository[Token]):
    ...
