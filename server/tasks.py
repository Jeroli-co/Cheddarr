from server import repositories
from server.api.dependencies import get_db
from server.core.scheduler import scheduler
from server.core.utils import send_email
from server.helpers import radarr, sonarr
from server.models import RequestStatus


def send_email_task(
    to_email: str, subject: str, html_template_name: str, environment: dict = None
):
    send_email(to_email, subject, html_template_name, environment)


def send_radarr_request_task(request_id: int):
    movie_request_repo = repositories.MovieRequestRepository(next(get_db()))
    request = movie_request_repo.find_by(id=request_id)
    radarr.send_request(request)


def send_sonarr_request_task(request_id: int):
    series_request_repo = repositories.SeriesRequestRepository(next(get_db()))
    request = series_request_repo.find_by(id=request_id)
    sonarr.send_request(request)


@scheduler.scheduled_job("interval", minutes=10)
def check_movie_requests_availability_task():
    movie_request_repo = repositories.MovieRequestRepository(next(get_db()))
    requests = movie_request_repo.find_all_by(status=RequestStatus.approved)
    for request in requests:
        config = request.selected_provider
        movie = radarr.lookup(
            config, tmdb_id=request.movie.tmdb_id, title=request.movie.title
        )
        if movie.has_file:
            request.status = RequestStatus.available
            movie_request_repo.save(request)


@scheduler.scheduled_job("interval", minutes=10)
def check_series_requests_availability_task():
    series_request_repo = repositories.SeriesRequestRepository(next(get_db()))
    requests = series_request_repo.find_all_by(status=RequestStatus.approved)
    for request in requests:
        config = request.selected_provider
        series_lookup = sonarr.lookup(config, tvdb_id=request.series.tvdb_id)
        series = sonarr.get_series(config, series_lookup.id)
        req_seasons_available = 0
        for req_season in request.seasons:
            if not req_season.episodes:
                matched_season = next(
                    s
                    for s in series.seasons
                    if s.season_number == req_season.season_number
                )
                if (
                    matched_season.episode_file_count
                    == matched_season.total_episode_count
                ):
                    req_season.status = RequestStatus.available
                    req_seasons_available += 1
            else:
                episodes = sonarr.get_episodes(config, series.id)
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
