from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import radarr, search, sonarr
from server.models import (
    Movie,
    MovieRequest,
    RequestStatus,
    Series,
    SeriesRequest,
    SonarrConfig,
)
from server.repositories import (
    MovieRepository,
    MovieRequestRepository,
    SeriesRequestRepository,
    UserRepository,
)
from server.repositories.requests import SeriesRepository

router = APIRouter()


@router.get("/movies/incoming/", response_model=list[schemas.MovieRequest])
def get_received_movie_requests(
    current_user: models.User = Depends(deps.get_current_user),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    requests = movie_request_repo.find_all_by(requested_user_id=current_user.id)
    return requests


@router.get("/movies/outgoing/", response_model=list[schemas.MovieRequest])
def get_sent_movie_requests(
    current_user: models.User = Depends(deps.get_current_user),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    requests = movie_request_repo.find_all_by(requesting_user_id=current_user.id)
    return requests


@router.post(
    "/movies/",
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
        movie = searched_movie.to_orm(Movie)

    movie_request = MovieRequest(
        requested_user=requested_user,
        requesting_user=current_user,
        movie=movie,
    )
    movie_request_repo.save(movie_request)
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
    request = movies_request_repo.find_by(id=request_id)
    if request is None or request.requested_user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != RequestStatus.pending:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Cannot update a non pending request."
        )
    if update.status == RequestStatus.approved:
        if update.provider_id is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set to accept a request.",
            )
        request.selected_provider_id = update.provider_id
        radarr.send_request(request)
    elif update.status == RequestStatus.refused:
        request.status = RequestStatus.refused
    movies_request_repo.save(request)
    return request


@router.get("/series/incoming/", response_model=list[schemas.SeriesRequest])
def get_received_series_requests(
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requests = series_request_repo.find_all_by(requested_user_id=current_user.id)
    return requests


@router.get("/series/outgoing/", response_model=list[schemas.SeriesRequest])
def get_sent_series_requests(
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requests = series_request_repo.find_all_by(requesting_user_id=current_user.id)
    return requests


@router.post(
    "/series/",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.SeriesRequest,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or series not found"},
        status.HTTP_409_CONFLICT: {"description": "Content already requested"},
    },
)
def add_series_request(
    request: schemas.SeriesRequestCreate,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    series_repo: SeriesRepository = Depends(deps.get_repository(SeriesRepository)),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requested_user = user_repo.find_by_username(request.requested_username)
    if requested_user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "The requested user does not exist."
        )

    series = series_repo.find_by(tvdb_id=request.tvdb_id)
    if series is None:
        searched_series = schemas.Series.parse_obj(
            search.find_tmdb_series_by_tvdb_id(request.tvdb_id)
        )
        if searched_series is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "The requested series was not found"
            )
        series = searched_series.to_orm(Series)

    series_request = series_request_repo.find_by_user_ids_and_tvdb_id(
        tvdb_id=request.tvdb_id,
        requesting_user_id=current_user.id,
        requested_user_id=requested_user.id,
    )
    if series_request is None:
        series_request = SeriesRequest(
            requested_user=requested_user,
            requesting_user=current_user,
            series=series,
        )
    for requested_season in request.seasons:
        existing_season = next(
            (
                season
                for season in series_request.seasons
                if season.season_number == requested_season.season_number
            ),
            None,
        )
        if existing_season is not None:
            for requested_episode in requested_season.episodes:
                existing_episode = next(
                    (
                        episode
                        for episode in existing_season.episodes
                        if episode.episode_number == requested_episode.episode_number
                    ),
                    None,
                )
                if existing_episode is not None:
                    existing_season.episodes.remove(existing_episode)


@router.patch("/series/{request_id}")
def update_series_request(
    request_id: int,
    current_user: models.User = Depends(deps.get_current_user),
):
    request = crud.series_child_request.get(db, id=id)
    if request is None or request.parent.requested_user != current_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if args.get("approved"):
        selected_provider_id = args.get("selected_provider_id")
        selected_provider = current_user.providers.filter_by(
            id=selected_provider_id
        ).one_or_none()
        if selected_provider is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
    request.update(args)
    if isinstance(request.selected_provider, SonarrConfig):
        sonarr.send_request(request)
    return request


@router.delete("/series/{request_id}")
def delete_series_request(
    request_id: int,
    current_user: models.User = Depends(deps.get_current_user),
):
    request = crud.series_child_request.get(db, id=id)
    if (
        request is None
        or request.requesting_user != current_user
        or request.parent.requested_user != current_user
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")

    request.delete()
    if not request.parent.children:
        request.parent.delete()
    return {"detail": "Request deleted."}
