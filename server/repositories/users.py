from typing import List, Optional

from sqlalchemy import func, or_

from server.models.users import Friendship, User
from .base import BaseRepository


class UserRepository(BaseRepository[User]):
    def find_by_email(self, email: str) -> Optional[User]:
        return (
            self.session.query(self.model)
            .filter(func.lower(User.email) == email.lower())
            .one_or_none()
        )

    def find_by_username(self, username: str) -> Optional[User]:
        return (
            self.session.query(self.model)
            .filter(func.lower(User.username) == username.lower())
            .one_or_none()
        )

    def find_by_username_or_email(self, username_or_email: str) -> Optional[User]:
        return (
            self.session.query(self.model)
            .filter(func.lower(User.email) == username_or_email.lower())
            .union(
                self.session.query(User).filter(
                    func.lower(User.username) == username_or_email.lower()
                )
            )
            .one_or_none()
        )


class FriendshipRepository(BaseRepository[Friendship]):
    def find_by_user_ids(self, user_id: int, other_user_id: int) -> Optional[Friendship]:
        return (
            self.session.query(self.model)
            .filter_by(requesting_user_id=user_id, requested_user_id=other_user_id)
            .union(
                self.session.query(Friendship).filter_by(
                    requesting_user_id=other_user_id, requested_user_id=user_id
                )
            )
            .one_or_none()
        )

    def find_all_by_user_id(self, user_id: int, pending: bool = None) -> List[Friendship]:
        query = self.session.query(self.model).filter(
            or_(self.model.requesting_user_id == user_id, self.model.requested_user_id == user_id)
        )
        if pending is not None:
            query = query.filter(self.model.pending == pending)
        return query.all()
