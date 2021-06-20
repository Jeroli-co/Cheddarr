from server.core.scheduler import scheduler
from server.database.session import Session
from server.models.media import MediaType
from server.models.requests import RequestStatus
from server.repositories.requests import MediaRequestRepository
from server.services import radarr


@scheduler.scheduled_job(
    "interval", id="radarr-sync", name="Radarr Sync", coalesce=True, minutes=10
)
async def sync_radarr():
    async with Session() as db_session:
        media_request_repo = MediaRequestRepository(db_session)
        requests = await media_request_repo.find_all_by(
            status=RequestStatus.approved, media_type=MediaType.movie
        )
        for request in requests:
            setting = request.selected_provider
            movie_lookup = await radarr.lookup(
                setting, tmdb_id=request.media.tmdb_id, title=request.media.title
            )
            if movie_lookup is None:
                continue
            if movie_lookup.has_file:
                request.status = RequestStatus.available
                await media_request_repo.save(request)
