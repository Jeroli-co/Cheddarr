from typing import Optional,List

from server.models import Movie, MovieRequest, Series, SeriesRequest
from server.repositories.base import BaseRepository


class MovieRepository(BaseRepository[Movie]):
    pass


class SeriesRepository(BaseRepository[Series]):
    pass


class MovieRequestRepository(BaseRepository[MovieRequest]):
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


class SeriesRequestRepository(BaseRepository[SeriesRequest]):
    def find_all_by_user_ids_and_tvdb_id(
        self, tvdb_id: int, requesting_user_id: int, requested_user_id: int
    ) -> List[SeriesRequest]:
        return (
            self.session.query(SeriesRequest)
            .join(SeriesRequest.series)
            .filter(
                Series.tvdb_id == tvdb_id,
                SeriesRequest.requesting_user_id == requesting_user_id,
                SeriesRequest.requested_user_id == requested_user_id,
            )
            .all()
        )
