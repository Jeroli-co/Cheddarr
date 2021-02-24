from server.api.dependencies import get_db
from server.core import scheduler
from server.helpers import sonarr
from server.models import RequestStatus
from server.repositories import SeriesRequestRepository


@scheduler.scheduled_job("interval", minutes=10)
def check_sonarr_series_availability():
    series_request_repo = SeriesRequestRepository(next(get_db()))
    requests = series_request_repo.find_all_by(status=RequestStatus.approved)
    for request in requests:
        setting = request.selected_provider
        series_lookup = sonarr.lookup(setting, tvdb_id=request.media.tvdb_id)
        series = sonarr.get_series(setting, series_lookup.id)
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
                episodes = sonarr.get_episodes(setting, series.id)
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
        series_request_repo.save(request)


def send_sonarr_request_task(request_id: int):
    series_request_repo = SeriesRequestRepository(next(get_db()))
    request = series_request_repo.find_by(id=request_id)
    sonarr.send_request(request)
