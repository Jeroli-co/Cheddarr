from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.api.dependencies import CurrentUser
from server.core.scheduler import scheduler
from server.models.settings import (
    ExternalServiceName,
    MediaProviderSetting,
    MediaProviderType,
    MediaServerLibrary,
    MediaServerSetting,
    PlexSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.models.users import UserRole
from server.repositories.settings import (
    MediaProviderSettingRepository,
    MediaServerSettingRepository,
)
from server.schemas.settings import (
    ExternalServiceSettingBase,
    PlexLibrarySection,
    PlexServer,
    PlexSettingCreateUpdate,
    PlexSettingSchema,
    RadarrInstanceInfo,
    RadarrSettingCreateUpdate,
    RadarrSettingSchema,
    SonarrInstanceInfo,
    SonarrSettingCreateUpdate,
    SonarrSettingSchema,
)
from server.services import plex, radarr, sonarr

router = APIRouter()


##########################################
# Plex                                   #
##########################################


@router.get(
    "/plex/servers",
    response_model=list[PlexServer],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex account linked"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_plex_account_servers(
    current_user: CurrentUser,
) -> list[PlexServer]:
    if current_user.plex_api_key is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex account linked to the user.")

    return await plex.get_account_servers(current_user.plex_api_key)


@router.get(
    "/plex",
    response_model=list[PlexSettingSchema],
    dependencies=[Depends(deps.get_current_user)],
)
async def get_plex_settings(
    setting_repo: MediaServerSettingRepository = Depends(deps.get_repository(MediaServerSettingRepository)),
) -> list[MediaServerSetting]:
    return await setting_repo.find_by(service_name=ExternalServiceName.plex).all()


@router.post(
    "/plex",
    status_code=status.HTTP_201_CREATED,
    response_model=PlexSettingSchema,
    responses={
        status.HTTP_409_CONFLICT: {"description": "Server already added"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def add_plex_setting(
    setting_in: PlexSettingCreateUpdate,
    *,
    setting_repo: MediaServerSettingRepository = Depends(deps.get_repository(MediaServerSettingRepository)),
) -> PlexSetting:
    if (
        await plex.get_server(
            base_url=setting_in.host,
            port=setting_in.port,
            ssl=setting_in.ssl,
            api_key=setting_in.api_key,
        )
        is None
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to  the Plex server.",
        )
    setting = await setting_repo.find_by(server_id=setting_in.server_id, service_name=ExternalServiceName.plex).one()
    if setting is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This server is already added.")

    setting = setting_in.to_orm(PlexSetting)
    await setting_repo.save(setting)

    return setting


@router.put(
    "/plex/{setting_id}",
    response_model=PlexSettingSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def update_plex_setting(
    setting_id: str,
    setting_in: PlexSettingCreateUpdate,
    *,
    setting_repo: MediaServerSettingRepository = Depends(deps.get_repository(MediaServerSettingRepository)),
) -> MediaServerSetting:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")
    if (
        await plex.get_server(
            base_url=setting_in.host,
            port=setting_in.port,
            ssl=setting_in.ssl,
            api_key=setting_in.api_key,
        )
        is None
    ):
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Failed to connect to connect the Plex server.",
        )

    return await setting_repo.update(setting, setting_in)


@router.delete(
    "/plex/{setting_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def delete_plex_setting(
    setting_id: str,
    *,
    setting_repo: MediaServerSettingRepository = Depends(deps.get_repository(MediaServerSettingRepository)),
) -> None:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")

    await setting_repo.remove(setting)


@router.get(
    "/plex/{setting_id}/libraries",
    response_model=list[PlexLibrarySection],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_plex_libraries(
    setting_id: str,
    *,
    setting_repo: MediaServerSettingRepository = Depends(deps.get_repository(MediaServerSettingRepository)),
) -> list[PlexLibrarySection]:
    setting = await setting_repo.find_by(id=setting_id, service_name=ExternalServiceName.plex).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex setting for this server.")

    libraries = await plex.get_server_library_sections(setting.host, setting.port, setting.ssl, setting.api_key)
    if libraries is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to get Plex libraries.")

    for library in libraries:
        library.enabled = any(lib.library_id == library.library_id for lib in setting.libraries)

    return libraries


@router.patch(
    "/plex/{setting_id}/libraries",
    response_model=list[PlexLibrarySection],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def update_plex_setting_libraries(
    setting_id: str,
    libraries_in: list[PlexLibrarySection],
    *,
    setting_repo: MediaServerSettingRepository = Depends(deps.get_repository(MediaServerSettingRepository)),
) -> list[MediaServerLibrary]:
    setting = await setting_repo.find_by(id=setting_id, service_name=ExternalServiceName.plex).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")

    for library_in in libraries_in:
        setting_library = next((lib for lib in setting.libraries if lib.library_id == library_in.library_id), None)
        if setting_library is None and library_in.enabled:
            setting.libraries.append(library_in.to_orm(MediaServerLibrary))
        elif setting_library is not None and not library_in.enabled:
            setting.libraries.remove(setting_library)

    await setting_repo.save(setting)
    if setting.libraries:
        from server.jobs.plex import sync_plex_servers_recently_added

        scheduler.add_job(
            sync_plex_servers_recently_added,
            run_date=datetime.now(tz=timezone.utc) + timedelta(seconds=10),
            args=[setting.server_id],
            coalesce=True,
            max_instances=1,
            replace_existing=True,
        )

    return setting.libraries


##########################################
# Radarr                                 #
##########################################


@router.post(
    "/radarr/instance-info",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_radarr_instance_info(setting_in: ExternalServiceSettingBase) -> RadarrInstanceInfo:
    instance_info = await radarr.get_instance_info(
        setting_in.api_key,
        setting_in.host,
        setting_in.port,
        setting_in.ssl,
        setting_in.version,
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")

    return instance_info


@router.get(
    "/radarr/{setting_id}/instance-info",
    response_model=RadarrInstanceInfo,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_radarr_setting_instance_info(
    setting_id: str,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> RadarrInstanceInfo:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr setting not found.")

    instance_info = await radarr.get_instance_info(
        setting.api_key,
        setting.host,
        setting.port,
        setting.ssl,
        setting.version,
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")

    return instance_info


@router.get(
    "/radarr",
    response_model=list[RadarrSettingSchema],
    dependencies=[Depends(deps.get_current_user)],
)
async def get_radarr_settings(
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> list[MediaProviderSetting]:
    return await setting_repo.find_by(service_name=ExternalServiceName.radarr).all()


@router.post(
    "/radarr",
    status_code=status.HTTP_201_CREATED,
    response_model=RadarrSettingSchema,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def add_radarr_setting(
    setting_in: RadarrSettingCreateUpdate,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> MediaProviderSetting:
    if not await radarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
        version=setting_in.version,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")

    setting = setting_in.to_orm(RadarrSetting)
    await setting_repo.save(setting)

    return setting


@router.put(
    "/radarr/{setting_id}",
    response_model=RadarrSettingSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def update_radarr_setting(
    setting_id: str,
    setting_in: RadarrSettingCreateUpdate,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> MediaProviderSetting:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Radarr setting.")

    if not await radarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
        version=setting_in.version,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")

    return await setting_repo.update(setting, setting_in)


@router.delete(
    "/radarr/{setting_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Radarr setting"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def delete_radarr_setting(
    setting_id: str,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> None:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr setting not found.")

    await setting_repo.remove(setting)


##########################################
# Sonarr                                 #
##########################################


@router.post(
    "/sonarr/instance-info",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_sonarr_instance_info(setting_in: ExternalServiceSettingBase) -> SonarrInstanceInfo:
    instance_info = await sonarr.get_instance_info(
        setting_in.api_key,
        setting_in.host,
        setting_in.port,
        setting_in.ssl,
        setting_in.version,
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")

    return instance_info


@router.get(
    "/sonarr/{setting_id}/instance-info",
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_sonarr_setting_instance_info(
    setting_id: str,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> SonarrInstanceInfo:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Setting not found.")

    instance_info = await sonarr.get_instance_info(
        api_key=setting.api_key,
        host=setting.host,
        port=setting.port,
        ssl=setting.ssl,
        version=setting.version,
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")

    return instance_info


@router.get(
    "/sonarr",
    response_model=list[SonarrSettingSchema],
    dependencies=[Depends(deps.get_current_user)],
)
async def get_sonarr_settings(
    setting_repo: MediaProviderSettingRepository = Depends(
        deps.get_repository(MediaProviderSettingRepository),
    ),
) -> list[MediaProviderSetting]:
    return await setting_repo.find_by(service_name=ExternalServiceName.sonarr).all()


@router.post(
    "/sonarr",
    status_code=status.HTTP_201_CREATED,
    response_model=SonarrSettingSchema,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def add_sonarr_setting(
    setting_in: SonarrSettingCreateUpdate,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> MediaProviderSetting:
    if not await sonarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
        version=setting_in.version,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")

    setting = setting_in.to_orm(SonarrSetting)
    await setting_repo.save(setting)

    return setting


@router.put(
    "/sonarr/{setting_id}",
    response_model=SonarrSettingSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def update_sonarr_setting(
    setting_id: str,
    setting_in: SonarrSettingCreateUpdate,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> MediaProviderSetting:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Sonarr setting.")

    if not await sonarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
        version=setting_in.version,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")

    return await setting_repo.update(setting, setting_in)


@router.delete(
    "/sonarr/{setting_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Sonarr setting"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def delete_sonarr_setting(
    setting_id: str,
    *,
    setting_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> None:
    setting = await setting_repo.find_by(id=setting_id).one()
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sonarr setting not found.")

    await setting_repo.remove(setting)


##########################################
# All providers                          #
##########################################


@router.get(
    "",
    response_model=list[RadarrSettingSchema | SonarrSettingSchema],
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_media_providers(
    provider_type: MediaProviderType | None = None,
    *,
    media_provider_repo: MediaProviderSettingRepository = Depends(deps.get_repository(MediaProviderSettingRepository)),
) -> list[MediaProviderSetting]:
    if provider_type is not None:
        return await media_provider_repo.find_by(provider_type=provider_type, enabled=True).all()

    return await media_provider_repo.find_by(enabled=True).all()
