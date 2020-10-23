from typing import List, Optional

from server.models import Movie, MovieRequest, SeriesRequest, Series
from server.repositories.base import BaseRepository


class MovieRepository(BaseRepository[Movie]):
    def find_by_tmdb_id(self, tmdb_id: int) -> Optional[Movie]:
        return self.session.query(Movie).filter_by(tmdb_id=tmdb_id).one_or_none()


class MovieRequestRepository(BaseRepository[MovieRequest]):
    def find_all_by_requested_user_id(
        self, requested_user_id: int
    ) -> List[MovieRequest]:
        return (
            self.session.query(MovieRequest)
            .filter_by(requested_user_id=requested_user_id)
            .all()
        )

    def find_all_by_requesting_user_id(
        self, requesting_user_id: int
    ) -> List[MovieRequest]:
        return (
            self.session.query(MovieRequest)
            .filter_by(requesting_user_id=requesting_user_id)
            .all()
        )

    def find_by_user_ids_and_tmdb_id(
        self, tmdb_id: int, requesting_user_id: int, requested_user_id: int
    ) -> Optional[MovieRequest]:
        return (
            self.session.query(MovieRequest)
            .join(MovieRequest.movie)
            .filter(
                Movie.tmdb_id == tmdb_id,
                MovieRequest.requesting_user_id == requesting_user_id,
                MovieRequest.requested_user_id == requested_user_id,
            )
            .one_or_none()
        )


class SeriesRepository(BaseRepository[Series]):
    def find_by_tvdb_id(self, tvdb_id: int) -> Optional[Movie]:
        return self.session.query(Series).filter_by(tvdb_id=tvdb_id).one_or_none()


class SeriesRequestRepository(BaseRepository[SeriesRequest]):
    def find_all_by_requested_user_id(
        self, requested_user_id: int
    ) -> List[SeriesRequest]:
        return (
            self.session.query(SeriesRequest)
            .filter_by(requested_user_id=requested_user_id)
            .all()
        )

    def find_all_by_requesting_user_id(
        self, requesting_user_id: int
    ) -> List[SeriesRequest]:
        return (
            self.session.query(SeriesRequest)
            .filter_by(requesting_user_id=requesting_user_id)
            .all()
        )
