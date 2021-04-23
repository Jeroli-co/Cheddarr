from typing import List, Optional

from sqlalchemy import func, select

from server.models.users import Friendship, User
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


class FriendshipRepository(BaseRepository[Friendship]):
    async def find_by_user_ids(self, user_id: int, other_user_id: int) -> Optional[Friendship]:
        result = await self.execute(
            select(self.model).where(
                (
                    (self.model.requesting_user_id == user_id)
                    & (self.model.requested_user_id == other_user_id)
                )
                | (
                    (self.model.requesting_user_id == other_user_id)
                    & (self.model.requested_user_id == user_id)
                )
            ),
        )
        return result.one_or_none()

    async def find_all_by_user_id(self, user_id: int, pending: bool = None) -> List[Friendship]:
        query = select(self.model).where(
            (self.model.requesting_user_id == user_id) | (self.model.requested_user_id == user_id)
        )
        if pending is not None:
            query = query.where(self.model.pending == pending)
        result = await self.execute(query)
        return result.all()
