from fastapi import APIRouter, Depends, HTTPException, status

from server import models, schemas, tasks
from server.api import dependencies as deps
from server.helpers import search
from server.repositories import (
    MovieRepository,
    MovieRequestRepository,
    SeriesRequestRepository,
    UserRepository,
)
from server.repositories.requests import SeriesRepository

router = APIRouter()


@router.get("/movies/incoming", response_model=list[schemas.MovieRequest])
def get_received_movie_requests(
    current_user: models.User = Depends(deps.get_current_user),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    requests = movie_request_repo.find_all_by(requested_user_id=current_user.id)
    return requests


@router.get("/movies/outgoing", response_model=list[schemas.MovieRequest])
def get_sent_movie_requests(
    current_user: models.User = Depends(deps.get_current_user),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    requests = movie_request_repo.find_all_by(requesting_user_id=current_user.id)
    return requests


@router.post(
    "/movies",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.MovieRequest,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Requested user or movie not found"},
        status.HTTP_409_CONFLICT: {"description": "Movie already requested"},
    },
)
def add_movie_request(
    request: schemas.MovieRequestCreate,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    movie_repo: MovieRepository = Depends(deps.get_repository(MovieRepository)),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):

    requested_user = user_repo.find_by_username(request.requested_username)
    if requested_user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "The requested user does not exist."
        )

    existing_request = movie_request_repo.find_by_user_ids_and_tmdb_id(
        tmdb_id=request.tmdb_id,
        requesting_user_id=current_user.id,
        requested_user_id=requested_user.id,
    )
    if existing_request is not None:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "This movie has already been requested."
        )

    movie = movie_repo.find_by(tmdb_id=request.tmdb_id)
    if movie is None:
        searched_movie = schemas.Movie.parse_obj(
            search.find_tmdb_movie(request.tmdb_id)
        )
        if searched_movie is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "The requested movie was not found"
            )
        movie = searched_movie.to_orm(models.Movie)

    movie_request = models.MovieRequest(
        requested_user=requested_user,
        requesting_user=current_user,
        movie=movie,
    )
    movie_request_repo.save(movie_request)
    requested_user.notifications.append(
        models.Notification(
            message=f"You have a new movie request by {current_user.username} for {movie.title}"
        )
    )
    user_repo.save(requested_user)
    return movie_request


@router.patch(
    "/movies/{request_id}",
    response_model=schemas.MovieRequest,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
        status.HTTP_403_FORBIDDEN: {"description": "Definitive status"},
        status.HTTP_400_BAD_REQUEST: {"description": "Missing provider ID"},
    },
)
def update_movie_request(
    request_id: int,
    update: schemas.RequestUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    movies_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    if (
        update.status != models.RequestStatus.approved
        and update.status != models.RequestStatus.refused
    ):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request = movies_request_repo.find_by(id=request_id)
    if request is None or request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != models.RequestStatus.pending:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Cannot update a non pending request."
        )
    if update.status == models.RequestStatus.approved:
        if update.provider_id is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set to accept a request.",
            )
        selected_provider = next(
            (
                provider
                for provider in current_user.providers
                if provider.id == update.provider_id
            ),
            None,
        )
        if selected_provider is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
        request.selected_provider = selected_provider
        request.status = models.RequestStatus.approved
        if isinstance(request.selected_provider, models.RadarrConfig):
            tasks.send_radarr_request_task.delay(request.id)

    elif update.status == models.RequestStatus.refused:
        request.status = models.RequestStatus.refused

    movies_request_repo.save(request)
    return request


@router.delete("/movies/{request_id}")
def delete_movie_request(
    request_id: int,
    current_user: models.User = Depends(deps.get_current_user),
    movies_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    request = movies_request_repo.find_by(id=request_id)
    if (
        request is None
        or request.requesting_user_id != current_user.id
        or request.requested_user_id != current_user.id
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if (
        request.status != models.RequestStatus.pending
        and request.requested_user_id != current_user.id
    ):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Cannot delete a non pending request."
        )
    movies_request_repo.remove(request)
    return {"detail": "Request deleted."}


@router.get("/series/incoming", response_model=list[schemas.SeriesRequest])
def get_received_series_requests(
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requests = series_request_repo.find_all_by(requested_user_id=current_user.id)
    return requests


@router.get("/series/outgoing", response_model=list[schemas.SeriesRequest])
def get_sent_series_requests(
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requests = series_request_repo.find_all_by(requesting_user_id=current_user.id)
    return requests


@router.post(
    "/series",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.SeriesRequest,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or series not found"},
        status.HTTP_409_CONFLICT: {"description": "Content already requested"},
    },
)
def add_series_request(
    request_in: schemas.SeriesRequestCreate,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    series_repo: SeriesRepository = Depends(deps.get_repository(SeriesRepository)),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requested_user = user_repo.find_by_username(request_in.requested_username)
    if requested_user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "The requested user does not exist."
        )

    series = series_repo.find_by(tvdb_id=request_in.tvdb_id)
    if series is None:
        searched_series = search.find_tmdb_series_by_tvdb_id(request_in.tvdb_id)
        if searched_series is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "The requested series was not found"
            )

        series = schemas.Series.parse_obj(searched_series).to_orm(models.Series)

    series_requests = series_request_repo.find_all_by_user_ids_and_tvdb_id(
        tvdb_id=request_in.tvdb_id,
        requesting_user_id=current_user.id,
        requested_user_id=requested_user.id,
    )

    series_request = None

    for r in series_requests:
        if r.status == models.RequestStatus.pending:
            series_request = r

    if not series_request:
        series_request = models.SeriesRequest(
            requested_user=requested_user,
            requesting_user=current_user,
            series=series,
        )
        update_existing_series_request(series_request, request_in)
        series_request_repo.save(series_request)
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

        update_existing_series_request(series_request, request_in)
    else:
        series_request.seasons = []

    series_request_repo.save(series_request)
    return series_request


def update_existing_series_request(
    series_request: models.SeriesRequest, request_in: schemas.SeriesRequestCreate
):
    if request_in.seasons is None:
        request_in.seasons = []
    for season in request_in.seasons:
        if season.episodes is None:
            season.episodes = []
        else:
            episodes = []
            for episode in season.episodes:
                episodes.append(episode.to_orm(models.EpisodeRequest))
            season.episodes = episodes

        already_added_season = next(
            (
                s
                for s in series_request.seasons
                if s.season_number == season.season_number
            ),
            None,
        )

        if not already_added_season:
            series_request.seasons.append(season.to_orm(models.SeasonRequest))
        else:
            if season.episodes:
                already_added_season.episodes.extend(season.episodes)
            else:
                already_added_season.episodes = season.episodes


@router.patch("/series/{request_id}", response_model=schemas.SeriesRequest)
def update_series_request(
    request_id: int,
    update: schemas.RequestUpdate,
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    if (
        update.status != models.RequestStatus.approved
        and update.status != models.RequestStatus.refused
    ):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request = series_request_repo.find_by(id=request_id)
    if request is None or request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != models.RequestStatus.pending:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Cannot update a non pending request."
        )
    if update.status == models.RequestStatus.approved:
        if update.provider_id is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set to accept a request.",
            )
        selected_provider = next(
            (
                provider
                for provider in current_user.providers
                if provider.id == update.provider_id
            ),
            None,
        )
        if selected_provider is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
        request.selected_provider = selected_provider
        request.status = models.RequestStatus.approved
        for season in request.seasons:
            season.status = models.RequestStatus.approved
            for episode in season.episodes:
                episode.status = models.RequestStatus.approved
        if isinstance(request.selected_provider, models.SonarrConfig):
            tasks.send_sonarr_request_task.delay(request.id)

    elif update.status == models.RequestStatus.refused:
        request.status = models.RequestStatus.refused

    series_request_repo.save(request)
    return request


@router.delete("/series/{request_id}")
def delete_series_request(
    request_id: int,
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    request = series_request_repo.find_by(id=request_id)
    if (
        request is None
        or request.requesting_user_id != current_user.id
        or request.requested_user_id != current_user.id
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if (
        request.status != models.RequestStatus.pending
        and request.requested_user_id != current_user.id
    ):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Cannot delete a non pending request."
        )
    series_request_repo.remove(request)
    return {"detail": "Request deleted."}
