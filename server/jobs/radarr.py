from server.api.dependencies import get_db
from server.core import scheduler
from server.models.media import MediaType
from server.models.requests import RequestStatus
from server.repositories.requests import MediaRequestRepository
from server.services import radarr


@scheduler.scheduled_job("interval", name="Radarr Sync", minutes=10)
def sync_radarr():
    media_request_repo = MediaRequestRepository(next(get_db()))
    requests = media_request_repo.find_all_by(
        status=RequestStatus.approved, media_type=MediaType.movie
    )
    for request in requests:
        setting = request.selected_provider
        movie_lookup = radarr.lookup(
            setting, tmdb_id=request.media.tmdb_id, title=request.media.title
        )
        if movie_lookup is None:
            continue
        if movie_lookup.has_file:
            request.status = RequestStatus.available
            media_request_repo.save(request)


def send_radarr_request_task(request_id: int):
    media_request_repo = MediaRequestRepository(next(get_db()))
    request = media_request_repo.find_by(id=request_id)
    radarr.send_request(request)
