from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core.security import check_permissions
from server.models.media import Media
from server.models.requests import (
    MediaRequest,
    RequestStatus,
)
from server.models.settings import MediaProviderType
from server.models.users import User, UserRole
from server.repositories.media import MediaRepository
from server.repositories.requests import MediaRequestRepository
from server.repositories.settings import MediaProviderSettingRepository
from server.schemas.media import MovieSchema, SeriesSchema
from server.schemas.requests import (
    MediaRequestSearchResponse,
    MediaRequestUpdate,
    MovieRequestCreate,
    MovieRequestSchema,
    SeriesRequestCreate,
    SeriesRequestSchema,
)
from server.services import tmdb
from server.services.requests import RequestService

router = APIRouter()


@router.get(
    "/incoming",
    response_model=MediaRequestSearchResponse,
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_requests]))],
)
async def get_received_requests(
    page: int = 1,
    per_page: int = 20,
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
) -> MediaRequestSearchResponse:
    requests = await media_request_repo.find_by().paginate(page=page, per_page=per_page)

    return MediaRequestSearchResponse(
        page=requests.page,
        pages=requests.pages,
        total=requests.total,
        items=requests.items,
    )


@router.get(
    "/outgoing",
    response_model=MediaRequestSearchResponse,
    dependencies=[Depends(deps.has_user_permissions([UserRole.request, UserRole.request_movies], options="or"))],
)
async def get_sent_requests(
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
) -> MediaRequestSearchResponse:
    requests = await media_request_repo.find_by(
        per_page=per_page,
        page=page,
        requesting_user_id=current_user.id,
    ).paginate()

    return MediaRequestSearchResponse(
        page=requests.page,
        pages=requests.pages,
        total=requests.total,
        items=requests.items,
    )


@router.post(
    "/movies",
    status_code=status.HTTP_201_CREATED,
    response_model=MovieRequestSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Movie not found"},
        status.HTTP_409_CONFLICT: {"description": "Movie already requested"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.request, UserRole.request_movies], options="or"))],
)
async def add_movie_request(
    request_in: MovieRequestCreate,
    current_user: User = Depends(deps.get_current_user),
    request_service: RequestService = Depends(deps.get_service(RequestService)),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
    media_provider_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> MediaRequest:
    existing_request = await media_request_repo.find_by_tmdb_id(
        tmdb_id=request_in.tmdb_id,
        requesting_user_id=current_user.id,
    ).one()
    if existing_request:
        raise HTTPException(status.HTTP_409_CONFLICT, "This movie has already been requested.")

    movie = await media_repo.find_by(tmdb_id=request_in.tmdb_id).one()
    if movie is None:
        searched_movie = await tmdb.get_tmdb_movie(request_in.tmdb_id)
        if searched_movie is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested movie was not found")
        movie = MovieSchema.parse_obj(searched_movie).to_orm(Media)

    movie_request = MediaRequest(
        requesting_user=current_user,
        media=movie,
        root_folder=request_in.root_folder,
        quality_profile_id=request_in.quality_profile_id,
        language_profile_id=request_in.quality_profile_id,
    )

    if check_permissions(current_user.roles, permissions=[UserRole.auto_approve]):
        default_provider = await media_provider_repo.find_by(
            provider_type=MediaProviderType.movie_provider,
            is_default=True,
        ).one()
        if default_provider is not None:
            movie_request.status = RequestStatus.approved
            movie_request.selected_provider = default_provider
            await request_service.send_movie_request(movie_request, default_provider)

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
    request_service: RequestService = Depends(deps.get_service(RequestService)),
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
    media_provider_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> MediaRequest:
    if request_update.status != RequestStatus.approved and request_update.status != RequestStatus.refused:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )

    request = await media_request_repo.find_by(id=request_id).one()
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")

    if request.status != RequestStatus.pending:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot update a non pending request.")

    if request_update.status == RequestStatus.approved:
        if request_update.provider_id is not None:
            selected_provider = await media_provider_repo.find_by(
                provider_type=MediaProviderType.movie_provider,
                id=request_update.provider_id,
            ).one()
            if selected_provider is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")

            request.selected_provider = selected_provider

        elif request.selected_provider is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "A provider must be set to accept the request.")

        request.status = RequestStatus.approved

    elif request_update.status == RequestStatus.refused:
        request.status = RequestStatus.refused

    current_movie_requests = await media_request_repo.find_by(media_id=request.media_id).all()
    for r in current_movie_requests:
        r.status = request.status
        await media_request_repo.save(r)

    if request.status == RequestStatus.approved:
        await request_service.send_movie_request(request, request.selected_provider)

    return request


@router.delete(
    "/movies/{request_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
    },
    dependencies=[
        Depends(
            deps.has_user_permissions(
                [UserRole.manage_requests, UserRole.request, UserRole.request_movies],
                options="or",
            ),
        ),
    ],
)
async def delete_movie_request(
    request_id: int,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
) -> None:
    request = await media_request_repo.find_by(id=request_id).one()
    if request is None or (
        request.requesting_user_id != current_user
        and not check_permissions(current_user.roles, [UserRole.manage_requests])
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")

    await media_request_repo.remove(request)


@router.post(
    "/series",
    status_code=status.HTTP_201_CREATED,
    response_model=SeriesRequestSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or series not found"},
        status.HTTP_409_CONFLICT: {"description": "Content already requested"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.request, UserRole.request_series], options="or"))],
)
async def add_series_request(
    request_in: SeriesRequestCreate,
    current_user: User = Depends(deps.get_current_user),
    media_repo: MediaRepository = Depends(deps.get_repository(MediaRepository)),
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
    media_provider_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
    request_service: RequestService = Depends(deps.get_service(RequestService)),
) -> Any:
    series = await media_repo.find_by(tmdb_id=request_in.tmdb_id).one()
    if series is None:
        searched_series = await tmdb.get_tmdb_series(request_in.tmdb_id)
        if searched_series is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "The requested series was not found")
        series = SeriesSchema.parse_obj(searched_series).to_orm(Media)

    series_request = await media_request_repo.find_by_tmdb_id(
        tmdb_id=series.tmdb_id,
        requesting_user_id=current_user.id,
        status=RequestStatus.pending,
    ).one()

    if series_request is None:
        series_request = MediaRequest(
            requesting_user=current_user,
            media=series,
            root_folder=request_in.root_folder,
            quality_profile_id=request_in.quality_profile_id,
            language_profile_id=request_in.quality_profile_id,
        )
        request_service.unify_series_request(series_request, request_in)

    elif request_in.season_requests:
        if not series_request.season_requests:
            raise HTTPException(status.HTTP_409_CONFLICT, "This series has already been requested entirely.")

        request_service.unify_season_requests(series_request.season_requests, request_in.season_requests)

        if not request_in.season_requests:
            raise HTTPException(status.HTTP_409_CONFLICT, "This content has already been requested.")

        request_service.unify_series_request(series_request, request_in)

    else:
        if not series_request.season_requests:
            raise HTTPException(status.HTTP_409_CONFLICT, "This content has already been requested.")
        series_request.season_requests = []

    if check_permissions(current_user.roles, permissions=[UserRole.auto_approve]):
        default_provider = await media_provider_repo.find_by(
            provider_type=MediaProviderType.series_provider,
            is_default=True,
        ).one()
        if default_provider is not None:
            series_request.status = RequestStatus.approved
            series_request.selected_provider = default_provider
            await request_service.send_series_request(series_request, default_provider)

    await media_request_repo.save(series_request)
    print(series_request.season_requests)
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
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
    media_provider_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
    request_service: RequestService = Depends(deps.get_service(RequestService)),
) -> Any:
    if request_update.status != RequestStatus.approved and request_update.status != RequestStatus.refused:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Request status can only be updated to approved or refused.",
        )
    request = await media_request_repo.find_by(id=request_id).one()
    if request is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "The request was not found.")
    if request.status != RequestStatus.pending:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cannot update a non-pending request.")
    if request_update.status == RequestStatus.approved:
        if request_update.provider_id is not None:
            selected_provider = await media_provider_repo.find_by(
                provider_type=MediaProviderType.series_provider,
                id=request_update.provider_id,
            ).one()
            if selected_provider is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "No matching provider.")
            request.selected_provider = selected_provider

        elif request.selected_provider is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "A provider must be set to accept the request.")

        request.status = RequestStatus.approved
        for season in request.seasons:
            season.status = RequestStatus.approved
            for episode in season.episodes:
                episode.status = RequestStatus.approved

    elif request_update.status == RequestStatus.refused:
        request.status = RequestStatus.refused

    await media_request_repo.save(request)

    if request.status == RequestStatus.approved:
        await request_service.send_series_request(request, request.selected_provider)

    return request


@router.delete(
    "/series/{request_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_403_FORBIDDEN: {"description": "Wrong request status"},
        status.HTTP_404_NOT_FOUND: {"description": "Request not found"},
    },
    dependencies=[
        Depends(
            deps.has_user_permissions(
                [UserRole.manage_requests, UserRole.request, UserRole.request_series],
                options="or",
            ),
        ),
    ],
)
async def delete_series_request(
    request_id: int,
    current_user: User = Depends(deps.get_current_user),
    media_request_repo: MediaRequestRepository = Depends(deps.get_repository(MediaRequestRepository)),
) -> None:
    request = await media_request_repo.find_by(id=request_id).one()
    if request is None or (
        request.requesting_user_id != current_user
        and not check_permissions(current_user.roles, [UserRole.manage_requests])
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This request does not exist.")
    await media_request_repo.remove(request)
