from typing import Any

from pydantic import parse_obj_as

from server.models.media import MediaType
from server.repositories.media import (
    MediaServerEpisodeRepository,
    MediaServerMediaRepository,
    MediaServerSeasonRepository,
)
from server.repositories.requests import MediaRequestRepository
from server.schemas.media import (
    EpisodeSchema,
    MediaSearchResponse,
    MovieSchema,
    SeasonSchema,
    SeriesSchema,
)
from server.schemas.plex import PlexMediaInfo
from server.schemas.requests import MovieRequestSchema, SeriesRequestSchema
from server.services.base import BaseService


class MediaService(BaseService):
    def __init__(
        self,
        server_media_repo: MediaServerMediaRepository,
        server_season_repo: MediaServerSeasonRepository,
        server_episode_repo: MediaServerEpisodeRepository,
        request_repo: MediaRequestRepository,
    ) -> None:
        self.server_media_repo = server_media_repo
        self.server_season_repo = server_season_repo
        self.server_episode_repo = server_episode_repo
        self.request_repo = request_repo

    @staticmethod
    def get_dependencies() -> list[Any]:
        return [
            MediaServerMediaRepository,
            MediaServerSeasonRepository,
            MediaServerEpisodeRepository,
            MediaRequestRepository,
        ]

    async def get_recently_added_media(
        self,
        media_type: MediaType,
        page: int,
        per_page: int,
    ) -> MediaSearchResponse:
        servers_recent_media_list = await self.server_media_repo.find_recently_added(media_type=media_type).paginate(
            page=page,
            per_page=per_page,
        )

        recent_media_list = []
        for server_media in servers_recent_media_list:
            server_media.media.media_servers_info = [PlexMediaInfo(**server_media.dict())]
            recent_media_list.append(server_media.media)

        return MediaSearchResponse(
            page=servers_recent_media_list.page,
            pages=servers_recent_media_list.pages,
            total=servers_recent_media_list.total,
            items=recent_media_list,
        )

    async def set_media_db_info(self, media: MovieSchema | SeriesSchema, current_user_id: int | None = None) -> None:
        db_media_list = await self.server_media_repo.find_by_media_external_id(
            tmdb_id=media.tmdb_id,
            imdb_id=media.imdb_id,
            tvdb_id=media.tvdb_id,
        ).all()
        media.media_servers_info = [PlexMediaInfo(**server_media.dict()) for server_media in db_media_list]

        if current_user_id is not None:
            requests = await self.request_repo.find_by_tmdb_id(
                requesting_user_id=current_user_id,
                tmdb_id=media.tmdb_id,
            ).all()
            if isinstance(media, MovieSchema):
                media.requests = parse_obj_as(list[MovieRequestSchema], requests)
            elif isinstance(media, SeriesSchema):
                media.requests = parse_obj_as(list[SeriesRequestSchema], requests)

    async def set_season_db_info(self, season: SeasonSchema, **external_ids: Any) -> None:
        db_seasons_list = await self.server_season_repo.find_by_external_id_and_season_number(
            season_number=season.season_number,
            **external_ids,
        ).all()
        if db_seasons_list is not None:
            season.media_servers_info = [PlexMediaInfo(**server_media.dict()) for server_media in db_seasons_list]

    async def set_episode_db_info(
        self,
        episode: EpisodeSchema,
        series_tmdb_id: int,
        season_number: int,
    ) -> None:
        db_episodes_list = await self.server_episode_repo.find_by_external_id_and_season_number_and_episode_number(
            tmdb_id=series_tmdb_id,
            season_number=season_number,
            episode_number=episode.episode_number,
        ).all()
        if db_episodes_list is not None:
            episode.media_servers_info = [PlexMediaInfo(**server_media.dict()) for server_media in db_episodes_list]
