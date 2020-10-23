from typing import List, Optional

from sqlalchemy import func

from .base import BaseRepository
from server.models import User, PlexAccount, Friendship


class UserRepository(BaseRepository[User]):
    def find_by_id(self, id: int) -> Optional[User]:
        return self.session.query(User).get(id)

    def find_by_email(self, email: str) -> Optional[User]:
        return (
            self.session.query(User)
            .filter(func.lower(User.email) == email.lower())
            .one_or_none()
        )

    def find_by_username(self, username: str) -> Optional[User]:
        return (
            self.session.query(User)
            .filter(func.lower(User.username) == username.lower())
            .one_or_none()
        )

    def find_by_username_or_email(self, username_or_email: str) -> Optional[User]:
        return (
            self.session.query(User)
            .filter(func.lower(User.email) == username_or_email.lower())
            .union(
                self.session.query(User).filter(
                    func.lower(User.username) == username_or_email.lower()
                )
            )
            .one_or_none()
        )


class PlexAccountRepository(BaseRepository[PlexAccount]):
    def find_by_user_id(self, user_id: int) -> Optional[PlexAccount]:
        return self.session.query(PlexAccount).filter_by(user_id=user_id).one_or_none()

    def find_by_plex_user_id(self, plex_user_id: int) -> Optional[PlexAccount]:
        return (
            self.session.query(PlexAccount)
            .filter_by(plex_user_id=plex_user_id)
            .one_or_none()
        )


class FriendshipRepository(BaseRepository[Friendship]):
    def find_by_user_ids(
        self, user_id: int, other_user_id: int
    ) -> Optional[Friendship]:
        return (
            self.session.query(Friendship)
            .filter_by(requesting_user_id=user_id, receiving_user_id=other_user_id)
            .union(
                self.session.query(Friendship).filter_by(
                    requesting_user_id=other_user_id, receiving_user_id=user_id
                )
            )
            .one_or_none()
        )

    def find_all_by_user_id(
        self, user_id: int, pending: bool = None
    ) -> List[Friendship]:
        query = (
            self.session.query(Friendship)
            .filter_by(requesting_user_id=user_id)
            .union(self.session.query(Friendship).filter_by(receiving_user_id=user_id))
        )
        if pending is not None:
            query = query.filter_by(pending=pending)
        return query.all()

    def find_all_requested_by_user_id(
        self, user_id: int, pending: bool = None
    ) -> List[Friendship]:
        query = self.session.query(Friendship).filter_by(
            requesting_user_id=user_id, pending=True
        )
        if pending is not None:
            query = query.filter_by(pending=pending)
        return query.all()

    def find_all_received_by_user_id(
        self, user_id: int, pending: bool = None
    ) -> List[Friendship]:
        query = self.session.query(Friendship).filter_by(
            receiving_user_id=user_id, pending=True
        )
        if pending is not None:
            query = query.filter_by(pending=pending)
        return query.all()
