from typing import Optional

from sqlalchemy import func, select

from server.models.users import User
from .base import BaseRepository


class UserRepository(BaseRepository[User]):
    async def find_by_email(self, email: str) -> Optional[User]:
        result = await self.execute(
            select(self.model).where(func.lower(self.model.email) == email.lower())
        )
        return result.one_or_none()

    async def find_by_username(self, username: str) -> Optional[User]:
        result = await self.execute(
            select(self.model).where(func.lower(self.model.username) == username.lower())
        )
        return result.one_or_none()

    async def find_by_username_or_email(self, username_or_email: str) -> Optional[User]:
        result = await self.execute(
            select(self.model).where(
                (func.lower(self.model.email) == username_or_email.lower())
                | (func.lower(self.model.username) == username_or_email.lower())
            )
        )
        return result.one_or_none()
