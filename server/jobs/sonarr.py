from server.core.scheduler import scheduler
from server.database.session import DBSession
from server.models.media import MediaType
from server.models.requests import RequestStatus
from server.repositories.requests import MediaRequestRepository
from server.services import sonarr


@scheduler.scheduled_job(
    "interval", id="sonarr-sync", name="Sonarr Sync", coalesce=True, minutes=10
)
async def sonarr_sync():
    async with DBSession.get_session(new_engine=True) as db_session:
        media_request_repo = MediaRequestRepository(db_session)
        requests = await media_request_repo.find_all_by(
            status=RequestStatus.approved, media_type=MediaType.series
        )
        for request in requests:
            setting = request.selected_provider
            series_lookup = await sonarr.lookup(setting, tvdb_id=request.media.tvdb_id)
            if series_lookup is None:
                continue
            series = await sonarr.get_series(setting, series_lookup.id)
            req_seasons_available = 0
            for req_season in request.seasons:
                if not req_season.episodes:
                    matched_season = next(
                        s for s in series.seasons if s.season_number == req_season.season_number
                    )
                    if matched_season.episode_file_count == matched_season.total_episode_count:
                        req_season.status = RequestStatus.available
                        req_seasons_available += 1
                else:
                    episodes = await sonarr.get_episodes(setting, series.id)
                    req_episodes_available = 0
                    for req_episode in req_season.episodes:
                        matched_episode = next(
                            e
                            for e in episodes
                            if e.season_number == req_season.season_number
                            and e.episode_number == req_episode.episode_number
                        )
                        if matched_episode.has_file:
                            req_episode.status = RequestStatus.available
                            req_episodes_available += 1
                    if req_episodes_available == len(req_season.episodes):
                        req_season.status = RequestStatus.available
                        req_seasons_available += 1
            if req_seasons_available == len(request.seasons):
                request.status = RequestStatus.available
            await media_request_repo.save(request)
