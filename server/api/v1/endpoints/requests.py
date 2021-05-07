from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core.security import check_permissions
from server.models.media import Media
from server.models.requests import (
    MovieRequest,
    RequestStatus,
    SeriesRequest,
)
from server.models.settings import MediaProviderType
from server.models.users import User, UserRole
from server.repositories.media import MediaRepository
from server.repositories.requests import MediaRequestRepository
from server.repositories.settings import MediaProviderSettingRepository
from server.schemas.core import ResponseMessage
from server.schemas.media import MovieSchema, SeriesSchema
from server.schemas.requests import (
    MediaRequestSearchResult,
    MediaRequestUpdate,
    MovieRequestCreate,
    MovieRequestSchema,
    SeriesRequestCreate,
    SeriesRequestSchema,
)
from server.services import tmdb
from server.services.core import send_movie_request, send_series_request, unify_series_request

router = APIRouter()


@router.get(
    "/incoming",
    response_model=MediaRequestSearchResult,
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_requests]))],
)
async def get_received_requests(
    page: int = 1,
    per_page: int = 20,
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requests, total_results, total_pages = await media_request_repo.find_all_by(
        per_page=per_page,
        page=page,
    )

    return MediaRequestSearchResult(
        page=page, total_pages=total_pages, total_results=total_results, results=requests
    )


@router.get(
    "/outgoing",
    response_model=MediaRequestSearchResult,
    dependencies=[
        Depends(
            deps.has_user_permissions([UserRole.request, UserRole.request_movies], options="or")
        )
    ],
)
async def get_sent_requests(
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    requests, total_results, total_pages = await media_request_repo.find_all_by(
        per_page=per_page,
        page=page,
        requesting_user_id=current_user.id,
    )

    return MediaRequestSearchResult(
        page=page, total_pages=total_pages, total_results=total_results, results=requests
    )


@router.post(
    "/movies",
    status_code=status.HTTP_201_CREATED,
    response_model=MovieRequestSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Movie not found"},
        status.HTTP_409_CONFLICT: {"description": "Movie already requested"},
    },
    dependencies=[
        Depends(
            deps.has_user_permissions([UserRole.request, UserRole.request_movies], options="or")
        )
    ],
)
async def add_movie_request(
    request_in: MovieRequestCreate,
    current_user: User = Depends(deps.get_current_user),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
    media_provider_repo: MediaProviderSettingRepository = Depends(
        deps.get_repository(MediaProviderSettingRepository)
    ),
):
    existing_request = await media_request_repo.find_all_by_tmdb_id(
        tmdb_id=request_in.tmdb_id,
        requesting_user_id=current_user.id,
    )
    if existing_request:
        raise HTTPException(status.HTTP_409_CONFLICT, "This movie has already been requested.")

    movie = await media_repo.find_by(tmdb_id=request_in.tmdb_id)
    if movie is None:
        searched_movie = await tmdb.get_tmdb_movie(request_in.tmdb_id)
        if searched_movie is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested movie was not found")
        movie = MovieSchema.parse_obj(searched_movie).to_orm(Media)

    movie_request = MovieRequest(
        requesting_user=current_user,
        media=movie,
        root_folder=request_in.root_folder,
        quality_profile_id=request_in.quality_profile_id,
        language_profile_id=request_in.quality_profile_id,
    )

    if check_permissions(current_user.roles, permissions=[UserRole.auto_approve]):
        default_provider = await media_provider_repo.find_by(
            provider_type=MediaProviderType.movie_provider, is_default=True
        )
        if default_provider is not None:
            movie_request.status = RequestStatus.approved
            movie_request.selected_provider = default_provider
            await send_movie_request(movie_request, default_provider)

    await media_request_repo.save(movie_request)
    return movie_request


@router.patch(
    "/movies/{request_id}",
    response_model=MovieRequestSchema,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Missing provider ID"},
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request or provider not found"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_requests]))],
)
async def update_movie_request(
    request_id: int,
    request_update: MediaRequestUpdate,
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
    media_provider_repo: MediaProviderSettingRepository = Depends(
        deps.get_repository(MediaProviderSettingRepository)
    ),
):
    if (
        request_update.status != RequestStatus.approved
        and request_update.status != RequestStatus.refused
    ):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request = await media_request_repo.find_by(id=request_id)
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != RequestStatus.pending:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot update a non pending request.")
    if request_update.status == RequestStatus.approved:
        if request_update.provider_id is not None:
            selected_provider = await media_provider_repo.find_by(
                provider_type=MediaProviderType.movie_provider, id=request_update.provider_id
            )
            if selected_provider is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
            request.selected_provider = selected_provider

        elif request.selected_provider is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set or a provider must be set to default to accept a request.",
            )
        request.status = RequestStatus.approved

    elif request_update.status == RequestStatus.refused:
        request.status = RequestStatus.refused

    current_movie_requests = await media_request_repo.find_all_by(media_id=request.media_id)
    for r in current_movie_requests:
        r.status = request.status
        await media_request_repo.save(r)

    if request.status == RequestStatus.approved:
        await send_movie_request(request, request.selected_provider)

    return request


@router.delete(
    "/movies/{request_id}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
    },
    dependencies=[
        Depends(
            deps.has_user_permissions(
                [UserRole.manage_requests, UserRole.request, UserRole.request_movies], options="or"
            )
        )
    ],
)
async def delete_movie_request(
    request_id: int,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    request = await media_request_repo.find_by(id=request_id)
    if request is None or (
        request.requesting_user_id != current_user
        and not check_permissions(current_user.roles, [UserRole.manage_requests])
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if request.status != RequestStatus.pending and request.requesting_user_id == current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot delete a non pending request.")
    await media_request_repo.remove(request)
    return {"detail": "Request deleted."}


@router.post(
    "/series",
    status_code=status.HTTP_201_CREATED,
    response_model=SeriesRequestSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or series not found"},
        status.HTTP_409_CONFLICT: {"description": "Content already requested"},
    },
    dependencies=[
        Depends(
            deps.has_user_permissions([UserRole.request, UserRole.request_series], options="or")
        )
    ],
)
async def add_series_request(
    request_in: SeriesRequestCreate,
    current_user: User = Depends(deps.get_current_user),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
    media_provider_repo: MediaProviderSettingRepository = Depends(
        deps.get_repository(MediaProviderSettingRepository)
    ),
):
    series = await media_repo.find_by(tmdb_id=request_in.tmdb_id)
    if series is None:
        searched_series = await tmdb.get_tmdb_series(request_in.tmdb_id)
        if searched_series is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested series was not found")
        series = SeriesSchema.parse_obj(searched_series).to_orm(Media, exclude={"seasons"})

    series_requests = await media_request_repo.find_all_by_tmdb_id(
        tmdb_id=series.tmdb_id,
        requesting_user_id=current_user.id,
        status=RequestStatus.pending,
    )

    series_request = next(iter(series_requests), None)

    if series_request is None:
        series_request = SeriesRequest(
            requesting_user=current_user,
            media=series,
            root_folder=request_in.root_folder,
            quality_profile_id=request_in.quality_profile_id,
            language_profile_id=request_in.quality_profile_id,
            seasons=[],
        )
        unify_series_request(series_request, request_in)

        if check_permissions(current_user.roles, permissions=[UserRole.auto_approve]):
            default_provider = await media_provider_repo.find_by(
                provider_type=MediaProviderType.series_provider, is_default=True
            )
            if default_provider is not None:
                series_request.status = RequestStatus.approved
                series_request.selected_provider = default_provider
                await send_series_request(series_request, default_provider)
        await media_request_repo.save(series_request)
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
        if not series_request.seasons:
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This content has already been requested."
            )
        series_request.seasons = []

    if check_permissions(current_user.roles, permissions=[UserRole.auto_approve]):
        default_provider = await media_provider_repo.find_by(
            provider_type=MediaProviderType.series_provider, is_default=True
        )
        if default_provider is not None:
            series_request.status = RequestStatus.approved
            series_request.selected_provider = default_provider
            await send_series_request(series_request, default_provider)

    await media_request_repo.save(series_request)
    return series_request


@router.patch(
    "/series/{request_id}",
    response_model=SeriesRequestSchema,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Missing provider ID"},
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request or provider not found"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_requests]))],
)
async def update_series_request(
    request_id: int,
    request_update: MediaRequestUpdate,
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
    media_provider_repo: MediaProviderSettingRepository = Depends(
        deps.get_repository(MediaProviderSettingRepository)
    ),
):
    if (
        request_update.status != RequestStatus.approved
        and request_update.status != RequestStatus.refused
    ):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request: Optional[SeriesRequest] = await media_request_repo.find_by(id=request_id)
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != RequestStatus.pending:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot update a non pending request.")
    if request_update.status == RequestStatus.approved:
        if request_update.provider_id is not None:
            selected_provider = await media_provider_repo.find_by(
                provider_type=MediaProviderType.series_provider, id=request_update.provider_id
            )
            if selected_provider is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
            request.selected_provider = selected_provider

        elif request.selected_provider is None:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "provider_id must be set or a provider must be set to default to accept a request.",
            )

        request.status = RequestStatus.approved
        for season in request.seasons:
            season.status = RequestStatus.approved
            for episode in season.episodes:
                episode.status = RequestStatus.approved

    elif request_update.status == RequestStatus.refused:
        request.status = RequestStatus.refused

    await media_request_repo.save(request)

    if request.status == RequestStatus.approved:
        await send_series_request(request, request.selected_provider)

    return request


@router.delete(
    "/series/{request_id}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
    },
    dependencies=[
        Depends(
            deps.has_user_permissions(
                [UserRole.manage_requests, UserRole.request, UserRole.request_series], options="or"
            )
        )
    ],
)
async def delete_series_request(
    request_id: int,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(
        deps.get_repository(MediaRequestRepository)
    ),
):
    request = await media_request_repo.find_by(id=request_id)
    if request is None or (
        request.requesting_user_id != current_user
        and not check_permissions(current_user.roles, [UserRole.manage_requests])
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    if request.status != RequestStatus.pending and request.requesting_user_id == current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot delete a non pending request.")
    await media_request_repo.remove(request)
    return {"detail": "Request deleted."}
