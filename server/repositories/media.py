from typing import List, Optional

from sqlalchemy import desc, or_

from server.models.media import Episode, Media, MediaServerMedia, MediaType, Season
from server.repositories.base import BaseRepository, paginate


class MediaRepository(BaseRepository[Media]):
    def find_by_external_id(self, external_ids: List) -> Optional[Media]:
        return (
            self.session.query(Media)
            .filter(
                or_(
                    Media.tmdb_id.in_(external_ids),
                    Media.imdb_id.in_(external_ids),
                    Media.tvdb_id.in_(external_ids),
                )
            )
            .one_or_none()
        )

    def find_all_recently_added(
        self, media_type: MediaType, page: int = None, per_page: int = None
    ):
        query = (
            self.session.query(Media)
            .join(MediaServerMedia)
            .filter(Media.media_type == media_type)
            .order_by(desc(MediaServerMedia.added_at))
        )
        if page is not None:
            return paginate(query, per_page, page)
        return query.all()


class SeasonRepository(BaseRepository[Season]):
    def find_by_external_id_and_season_number(
        self, season_number: int, external_ids: List
    ) -> Optional[Season]:
        return (
            self.session.query(Season)
            .join(Season.media)
            .filter(
                or_(
                    Media.tmdb_id.in_(external_ids),
                    Media.imdb_id.in_(external_ids),
                    Media.tvdb_id.in_(external_ids),
                ),
                Season.season_number == season_number,
            )
            .one_or_none()
        )


class EpisodeRepository(BaseRepository[Episode]):
    def find_all_by_external_id_and_season_number(
        self, external_ids: List, season_number: int
    ) -> List[Episode]:
        return (
            self.session.query(Episode)
            .join(Season)
            .join(Media)
            .filter(
                or_(
                    Media.tmdb_id.in_(external_ids),
                    Media.imdb_id.in_(external_ids),
                    Media.tvdb_id.in_(external_ids),
                ),
                Season.season_number == season_number,
            )
            .all()
        )

    def find_by_external_id_and_season_number_and_episode_number(
        self,
        external_ids: List,
        season_number: int,
        episode_number: int,
    ) -> Optional[Episode]:
        return (
            self.session.query(Episode)
            .join(Season)
            .join(Media)
            .filter(
                or_(
                    Media.tmdb_id.in_(external_ids),
                    Media.imdb_id.in_(external_ids),
                    Media.tvdb_id.in_(external_ids),
                ),
                Season.season_number == season_number,
                Episode.episode_number == episode_number,
            )
            .one_or_none()
        )