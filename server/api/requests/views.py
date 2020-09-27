from flask_login import current_user
from flask_login.utils import login_required
from werkzeug.exceptions import BadRequest, Conflict, Forbidden, NotFound

from server.api.users.models import User
from server.extensions.marshmallow import body
from .models import (
    SeriesRequest,
    SeriesChildRequest,
    MovieRequest,
    EpisodeRequest,
)
from .schemas import SeriesChildRequestSchema, SeriesRequestSchema, MovieRequestSchema
from ...tasks import confirm_sonarr_request


@login_required
def get_received_movie_requests():
    requests = current_user.received_movies_requests
    return MovieRequestSchema().jsonify(requests, many=True)


@login_required
def get_sent_movie_requests():
    requests = current_user.sent_movies_requests
    return MovieRequestSchema().jsonify(requests, many=True)


@login_required
@body(MovieRequestSchema)
def add_movie_request(request: dict):
    tmdb_id = request["tmdb_id"]
    requested_username = request["requested_username"]

    requested_user = User.find(username=requested_username)
    if requested_user is None:
        raise BadRequest("The requested user does not exist.")

    existing_movie: MovieRequest = MovieRequest.find(
        requesting_user=current_user, requested_user=requested_user, tmdb_id=tmdb_id
    )
    if existing_movie is not None:
        raise Conflict("This movie has already been requested.")

    movie_request = MovieRequest(
        requested_user=requested_user, requesting_user=current_user, tmdb_id=tmdb_id
    )
    movie_request.save()
    return MovieRequestSchema().jsonify(movie_request)


@login_required
def get_received_series_requests():
    requests = current_user.received_series_requests
    return SeriesRequestSchema().jsonify(requests, many=True)


@login_required
def get_sent_series_requests():
    requests = current_user.sent_series_requests
    return SeriesChildRequestSchema().jsonify(requests, many=True)


@login_required
@body(SeriesChildRequestSchema)
def add_series_request(request: dict):
    tvdb_id = request["tvdb_id"]
    requested_username = request["requested_username"]
    requested_seasons = request["seasons"]

    requested_user = User.find(username=requested_username)
    if requested_user is None:
        raise BadRequest("The requested user does not exist.")

    series: SeriesRequest = SeriesRequest.find(
        tvdb_id=tvdb_id, requested_user=requested_user
    )
    if series is None:
        series = SeriesRequest(tvdb_id=tvdb_id, requested_user=requested_user)

    children = SeriesChildRequest.findAll(series_id=series.id)
    for existing_child in children:
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
                    requested_seasons.remove(duplicate_season)
                for existing_episode in existing_season.episodes:
                    duplicate_episode: EpisodeRequest = next(
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
    if not requested_seasons:
        raise Conflict("This content has already been requested.")

    child_request = SeriesChildRequest(
        requesting_user=current_user, seasons=requested_seasons
    )
    child_request.series = series
    series.save()
    return SeriesChildRequestSchema().jsonify(child_request)


@login_required
@body(SeriesChildRequestSchema, only=["approved", "refused", "selected_provider_id"])
def update_series_request(args: dict, id: int):
    request: SeriesChildRequest = SeriesChildRequest.find(id=id)
    if request is None:
        raise NotFound("This request does not exist.")
    if request.series.requested_user != current_user:
        raise Forbidden("This is not one of your requests.")
    if args.get("approved"):
        selected_provider_id = args.get("selected_provider_id")
        selected_provider = current_user.providers.filter_by(
            id=selected_provider_id
        ).one_or_none()
        if selected_provider is None:
            raise BadRequest("No matching provider.")
    request.update(args)
    confirm_sonarr_request(request)
    return SeriesChildRequestSchema().jsonify(request)


@login_required
def delete_series_request(id: int):
    request: SeriesChildRequest = SeriesChildRequest.find(id=id)
    if request is None:
        raise NotFound("This request does not exist.")
    series = request.series
    if request.requesting_user != current_user or series.requested_user != current_user:
        raise Forbidden("This is not one of your requests.")
    request.delete()
    if not series.children:
        series.delete()
    return {"message": "request deleted."}
