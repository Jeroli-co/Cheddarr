from server.api.dependencies import get_db
from server.core import scheduler
from server.helpers import radarr
from server.models import RequestStatus
from server.repositories import MovieRequestRepository


@scheduler.scheduled_job("interval", minutes=10)
def check_radarr_movies_availability():
    movie_request_repo = MovieRequestRepository(next(get_db()))
    requests = movie_request_repo.find_all_by(status=RequestStatus.approved)
    for request in requests:
        setting = request.selected_provider
        movie = radarr.lookup(setting, tmdb_id=request.media.tmdb_id, title=request.media.title)
        if movie.has_file:
            request.status = RequestStatus.available
            movie_request_repo.save(request)


def send_radarr_request_task(request_id: int):
    movie_request_repo = MovieRequestRepository(next(get_db()))
    request = movie_request_repo.find_by(id=request_id)
    radarr.send_request(request)
