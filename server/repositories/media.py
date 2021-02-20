from typing import Optional

from server.models import Episode, Media, Season
from server.repositories.base import BaseRepository


class MediaRepository(BaseRepository[Media]):
    pass


class SeasonRepisitory(BaseRepository[Season]):
    def find_by_tmdb_id_and_season_number(
        self, tmdb_id: int, season_number: int
    ) -> Optional[Season]:
        return (
            self.session.query(Season)
            .join(Season.media)
            .filter(
                Media.tmdb_id == tmdb_id,
                Season.season_number == season_number,
            )
            .one_or_none()
        )


class EpisodeRepository(BaseRepository[Episode]):
    def find_by_tmdb_id_and_season_number_and_episode_number(
        self, tmdb_id: int, season_number: int, episode_number: int
    ) -> Optional[Episode]:
        return (
            self.session.query(Episode)
            .join(Episode.season)
            .join(Season.media)
            .filter(
                Media.tmdb_id == tmdb_id,
                Season.season_number == season_number,
                Episode.episode_number == episode_number,
            )
            .one_or_none()
        )
