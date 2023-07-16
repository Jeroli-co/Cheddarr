from typing import Any

from server.models.requests import EpisodeRequest, MediaRequest, SeasonRequest
from server.models.settings import ExternalServiceName, MediaProviderSetting
from server.schemas.requests import SeasonRequestSchema, SeriesRequestCreate
from server.services import radarr, sonarr
from server.services.base import BaseService


class RequestService(BaseService):
    def __init__(self) -> None:
        pass

    @staticmethod
    def get_dependencies() -> list[Any]:
        return []

    @classmethod
    def unify_series_request(cls, series_request: MediaRequest, request_in: SeriesRequestCreate) -> None:
        if request_in.season_requests is None:
            request_in.season_requests = []
        for season_request_in in request_in.season_requests:
            if season_request_in.episode_requests is None:
                season_request_in.episode_requests = []

            episode_requests = [
                episode_request.to_orm(EpisodeRequest) for episode_request in season_request_in.episode_requests
            ]

            already_added_season = next(
                (s for s in series_request.season_requests if s.season_number == season_request_in.season_number),
                None,
            )

            if not already_added_season:
                series_request.season_requests.append(season_request_in.to_orm(SeasonRequest))
                series_request.season_requests[-1].episode_requests = episode_requests
            elif season_request_in.episode_requests:
                already_added_season.episode_requests.extend(episode_requests)
            else:
                already_added_season.episode_requests = episode_requests

    @classmethod
    def unify_season_requests(
        cls,
        season_requests: list[SeasonRequest],
        season_requests_in: list[SeasonRequestSchema],
    ) -> None:
        for season_request in season_requests:
            duplicate_season_request = next(
                (season for season in season_requests_in if season.season_number == season_request.season_number),
                None,
            )
            if duplicate_season_request is not None:
                if not duplicate_season_request.episode_requests and season_request.episode_requests:
                    continue

                if not season_request.episode_requests:
                    season_requests_in.remove(duplicate_season_request)
                    continue

                cls.unify_episode_requests(season_request.episode_requests, duplicate_season_request)

                if not duplicate_season_request.episode_requests:
                    season_requests_in.remove(duplicate_season_request)

    @classmethod
    def unify_episode_requests(
        cls,
        episode_requests: list[EpisodeRequest],
        season_request_in: SeasonRequestSchema,
    ) -> None:
        if not season_request_in.episode_requests:
            season_request_in.episode_requests = []

        for episode_request in episode_requests:
            duplicate_episode = next(
                (
                    episode
                    for episode in season_request_in.episode_requests
                    if episode.episode_number == episode_request.episode_number
                ),
                None,
            )
            if duplicate_episode is not None:
                season_request_in.episode_requests.remove(duplicate_episode)

    @staticmethod
    async def send_series_request(request: MediaRequest, provider: MediaProviderSetting) -> None:
        if provider.service_name == ExternalServiceName.sonarr:
            await sonarr.send_request(request)

    @staticmethod
    async def send_movie_request(request: MediaRequest, provider: MediaProviderSetting) -> None:
        if provider.service_name == ExternalServiceName.radarr:
            await radarr.send_request(request)
