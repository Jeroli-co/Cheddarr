from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core.scheduler import scheduler
from server.jobs.radarr import send_radarr_request_task
from server.jobs.sonarr import send_sonarr_request_task
from server.models.media import Media
from server.models.requests import (
    EpisodeRequest,
    MovieRequest,
    RequestStatus,
    SeasonRequest,
    SeriesRequest,
)
from server.models.settings import RadarrSetting, SonarrSetting
from server.models.users import User
from server.repositories.media import MediaRepository
from server.repositories.requests import MediaRequestRepository
from server.repositories.users import UserRepository
from server.schemas.base import ResponseMessage
from server.schemas.media import MovieSchema, SeriesSchema
from server.schemas.requests import (
    MediaRequestUpdate,
    MovieRequestCreate,
    MovieRequestSchema,
    SeriesRequestCreate,
    SeriesRequestSchema,
)
from server.services import tmdb

router = APIRouter()


@router.get("/movies/incoming", response_model=List[MovieRequestSchema])
def get_received_movie_requests(
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requests = media_request_repo.find_all_by(requested_user_id=current_user.id)
    return requests


@router.get("/movies/outgoing", response_model=List[MovieRequestSchema])
def get_sent_movie_requests(
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requests = media_request_repo.find_all_by(requesting_user_id=current_user.id)
    return requests


@router.post(
    "/movies",
    status_code=status.HTTP_201_CREATED,
    response_model=MovieRequestSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Requested user or movie not found"},
        status.HTTP_409_CONFLICT: {"description": "Movie already requested"},
    },
)
def add_movie_request(
    request: MovieRequestCreate,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):

    requested_user = user_repo.find_by_username(request.requested_username)
    if requested_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested user does not exist.")

    existing_request = media_request_repo.find_all_by_user_ids_and_tmdb_id(
        tmdb_id=request.tmdb_id,
        requesting_user_id=current_user.id,
        requested_user_id=requested_user.id,
    )
    if existing_request:
        raise HTTPException(status.HTTP_409_CONFLICT, "This movie has already been requested.")

    movie = media_repo.find_by(tmdb_id=request.tmdb_id)
    if movie is None:
        searched_movie = tmdb.get_tmdb_movie(request.tmdb_id)
        if searched_movie is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested movie was not found")
        movie = MovieSchema.parse_obj(searched_movie).to_orm(Media)

    movie_request = MovieRequest(
        requested_user=requested_user,
        requesting_user=current_user,
        media=movie,
    )
    media_request_repo.save(movie_request)
    return movie_request


@router.patch(
    "/movies/{request_id}",
    response_model=MovieRequestSchema,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Missing provider ID"},
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request or provider not found"},
    },
)
def update_movie_request(
    request_id: int,
    update: MediaRequestUpdate,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    if update.status != RequestStatus.approved and update.status != RequestStatus.refused:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request = media_request_repo.find_by(id=request_id)
    if request is None or request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != RequestStatus.pending:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot update a non pending request.")
    if update.status == RequestStatus.approved:
        if update.provider_id is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set to accept a request.",
            )
        selected_provider = next(
            (
                provider
                for provider in current_user.media_providers
                if provider.id == update.provider_id
            ),
            None,
        )
        if selected_provider is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
        request.selected_provider = selected_provider
        request.status = RequestStatus.approved
        if isinstance(request.selected_provider, RadarrSetting):
            scheduler.add_job(send_radarr_request_task, args=[request.id])

    elif update.status == RequestStatus.refused:
        request.status = RequestStatus.refused

    current_movie_requests = media_request_repo.find_all_by(media_id=request.media_id)
    for r in current_movie_requests:
        r.status = request.status
        media_request_repo.save(r)

    return request


@router.delete(
    "/movies/{request_id}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
    },
)
def delete_movie_request(
    request_id: int,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    request = media_request_repo.find_by(id=request_id)
    if request is None or (
        request.requesting_user_id != current_user.id
        and request.requested_user_id != current_user.id
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if request.status != RequestStatus.pending and request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot delete a non pending request.")
    media_request_repo.remove(request)
    return {"detail": "Request deleted."}


@router.get("/series/incoming", response_model=List[SeriesRequestSchema])
def get_received_series_requests(
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requests = media_request_repo.find_all_by(requested_user_id=current_user.id)
    return requests


@router.get("/series/outgoing", response_model=List[SeriesRequestSchema])
def get_sent_series_requests(
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requests = media_request_repo.find_all_by(requesting_user_id=current_user.id)
    return requests


@router.post(
    "/series",
    status_code=status.HTTP_201_CREATED,
    response_model=SeriesRequestSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or series not found"},
        status.HTTP_409_CONFLICT: {"description": "Content already requested"},
    },
)
def add_series_request(
    request_in: SeriesRequestCreate,
    current_user: User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requested_user = user_repo.find_by_username(request_in.requested_username)
    if requested_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested user does not exist.")

    series = media_repo.find_by(tmdb_id=request_in.tmdb_id)
    if series is None:
        searched_series = tmdb.get_tmdb_series(request_in.tmdb_id)
        if searched_series is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested series was not found")

        series = SeriesSchema.parse_obj(searched_series).to_orm(Media)

    series_requests = media_request_repo.find_all_by_user_ids_and_tmdb_id(
        tmdb_id=series.tmdb_id,
        requesting_user_id=current_user.id,
        requested_user_id=requested_user.id,
    )

    series_request: Optional[SeriesRequest] = None

    for r in series_requests:
        if isinstance(r, SeriesRequest) and r.status == RequestStatus.pending:
            series_request = r

    if not series_request:
        series_request = SeriesRequest(
            requested_user=requested_user,
            requesting_user=current_user,
            media=series,
        )
        unify_series_request(series_request, request_in)
        media_request_repo.save(series_request)
        return series_request

    if request_in.seasons:
        if not series_request.seasons:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "This series has already been requested entirely.",
            )
        for db_season_req in series_request.seasons:
            duplicate_season = next(
                (
                    season
                    for season in request_in.seasons
                    if season.season_number == db_season_req.season_number
                ),
                None,
            )
            if duplicate_season is not None:
                if not duplicate_season.episodes and db_season_req.episodes:
                    continue

                if not db_season_req.episodes:
                    request_in.seasons.remove(duplicate_season)
                    continue

                for db_episode_req in db_season_req.episodes:
                    duplicate_episode = next(
                        (
                            episode
                            for episode in duplicate_season.episodes
                            if episode.episode_number == db_episode_req.episode_number
                        ),
                        None,
                    )
                    if duplicate_episode is not None:
                        duplicate_season.episodes.remove(duplicate_episode)
                if not duplicate_season.episodes:
                    request_in.seasons.remove(duplicate_season)
        if not request_in.seasons:
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This content has already been requested."
            )

        unify_series_request(series_request, request_in)
    else:
        series_request.seasons = []

    media_request_repo.save(series_request)
    return series_request


def unify_series_request(series_request: SeriesRequest, request_in: SeriesRequestCreate):
    if request_in.seasons is None:
        request_in.seasons = []
    for season in request_in.seasons:
        if season.episodes is None:
            season.episodes = []
        else:
            episodes = []
            for episode in season.episodes:
                episodes.append(episode.to_orm(EpisodeRequest))
            season.episodes = episodes

        already_added_season = next(
            (s for s in series_request.seasons if s.season_number == season.season_number),
            None,
        )

        if not already_added_season:
            series_request.seasons.append(season.to_orm(SeasonRequest))
        else:
            if season.episodes:
                already_added_season.episodes.extend(season.episodes)
            else:
                already_added_season.episodes = season.episodes


@router.patch(
    "/series/{request_id}",
    response_model=SeriesRequestSchema,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Missing provider ID"},
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request or provider not found"},
    },
)
def update_series_request(
    request_id: int,
    update: MediaRequestUpdate,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    if update.status != RequestStatus.approved and update.status != RequestStatus.refused:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request: Optional[SeriesRequest] = media_request_repo.find_by(id=request_id)
    if request is None or request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != RequestStatus.pending:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot update a non pending request.")
    if update.status == RequestStatus.approved:
        if update.provider_id is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set to accept a request.",
            )
        selected_provider = next(
            (
                provider
                for provider in current_user.media_providers
                if provider.id == update.provider_id
            ),
            None,
        )
        if selected_provider is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
        request.selected_provider = selected_provider
        request.status = RequestStatus.approved
        for season in request.seasons:
            season.status = RequestStatus.approved
            for episode in season.episodes:
                episode.status = RequestStatus.approved
        if isinstance(request.selected_provider, SonarrSetting):
            scheduler.add_job(send_sonarr_request_task, args=[request.id])

    elif update.status == RequestStatus.refused:
        request.status = RequestStatus.refused

    media_request_repo.save(request)
    return request


@router.delete(
    "/series/{request_id}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
    },
)
def delete_series_request(
    request_id: int,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    request = media_request_repo.find_by(id=request_id)
    if request is None or (
        request.requesting_user_id != current_user.id
        and request.requested_user_id != current_user.id
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if request.status != RequestStatus.pending and request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot delete a non pending request.")
    media_request_repo.remove(request)
    return {"detail": "Request deleted."}
