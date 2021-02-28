from typing import List, Optional

from sqlalchemy import or_

from server.models import Episode, Media, MediaServerMedia, MediaServerSetting, Season
from server.repositories.base import BaseRepository


class MediaRepository(BaseRepository[Media]):
    def find_by_any_external_id(self, external_ids: List) -> Optional[Media]:
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


class SeasonRepository(BaseRepository[Season]):
    def find_by_any_external_id_and_season_number(
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
    def find_by_any_external_id_and_season_number_and_episode_number(
        self, season_number: int, episode_number: int, external_ids: List
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
