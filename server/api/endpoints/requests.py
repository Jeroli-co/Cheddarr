from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from server import models, schemas
from server.api import dependencies as deps
from server.helpers import search, sonarr
from server.models import Movie, MovieRequest, Series, SeriesRequest, SonarrConfig
from server.repositories import (
    MovieRepository,
    MovieRequestRepository,
    SeriesRequestRepository,
    UserRepository,
)
from server.repositories.requests import SeriesRepository

router = APIRouter()


@router.get("/movies/received/", response_model=schemas.MovieRequest)
def get_received_movie_requests(
    current_user: models.User = Depends(deps.get_current_user),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    requests = movie_request_repo.find_all_by_requested_user_id(current_user.id)
    return requests


@router.get("/movies/sent/", response_model=schemas.MovieRequest)
def get_sent_movie_requests(
    current_user: models.User = Depends(deps.get_current_user),
    movie_request_repo: MovieRequestRepository = Depends(
        deps.get_repository(MovieRequestRepository)
    ),
):
    requests = movie_request_repo.find_all_by_requesting_user_id(current_user.id)
    return requests


@router.post(
    "/movies/",
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

    movie = movie_repo.find_by_tmdb_id(request.tmdb_id)
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


@router.get("/series/received/")
def get_received_series_requests(
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requests = series_request_repo.find_all_by_requested_user_id(current_user.id)
    return requests


@router.get("/series/sent/")
def get_sent_series_requests(
    current_user: models.User = Depends(deps.get_current_user),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    requests = series_request_repo.find_all_by_requesting_user_id(current_user.id)
    return requests


@router.post(
    "/series/",
    response_model=schemas.SeriesRequest,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or series not found"},
        status.HTTP_409_CONFLICT: {"description": "Content already requested"},
    },
)
def add_series_request(
    request,
    current_user: models.User = Depends(deps.get_current_user),
    user_repo: UserRepository = Depends(deps.get_repository(UserRepository)),
    series_repo: SeriesRepository = Depends(deps.get_repository(SeriesRepository)),
    series_request_repo: SeriesRequestRepository = Depends(
        deps.get_repository(SeriesRequestRepository)
    ),
):
    tvdb_id = request["tvdb_id"]
    requested_username = request["requested_username"]
    requested_seasons = request["seasons"]

    requested_user = user_repo.find_by_username(requested_username)
    if requested_user is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "The requested user does not exist."
        )

    series = series_repo.find_by_tvdb_id(tvdb_id=tvdb_id)
    if series is None:
        searched_series = schemas.Series.parse_obj(
            search.find_tmdb_series_by_tvdb_id(request.tmdb_id)
        )
        if searched_series is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, "The requested series was not found"
            )
        series = searched_series.to_orm(Series)

    series_request = SeriesRequest(
        requested_user=requested_user,
        requesting_user=current_user,
        series=series,
    )

    existing_request = crud.series_child_request.get_all(
        db, series_id=series_request.id
    )
    for existing_child in existing_children:
        for existing_season in existing_child.seasons:
            duplicate_season = next(
                (
                    season
                    for season in requested_seasons
                    if season.season_number == existing_season.season_number
                ),
                None,
            )
            if duplicate_season is not None:
                if not existing_season.episodes:
                    duplicate_season.episodes = []
                for existing_episode in existing_season.episodes:
                    duplicate_episode = next(
                        (
                            episode
                            for episode in duplicate_season.episodes
                            if episode.episode_number == existing_episode.episode_number
                        ),
                        None,
                    )
                    if duplicate_episode is not None:
                        duplicate_season.episodes.remove(duplicate_episode)
                if not duplicate_season.episodes:
                    requested_seasons.remove(duplicate_season)
    # Every seasons in the request have alredy been requested.
    if not requested_seasons and existing_children:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "This content has already been requested."
        )

    child_request = crud.series_child_request.create(
        db, requesting_user=current_user, seasons=requested_seasons
    )
    child_request.parent = series_request
    series_request.save()
    return child_request


@router.patch("/series/<int:id>/")
def update_series_request(
    args: dict,
    id: int,
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


@router.delete("/series/<int:id>")
def delete_series_request(
    id: int,
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
