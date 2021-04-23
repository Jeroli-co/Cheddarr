from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status

from server.api import dependencies as deps
from server.core import scheduler
from server.jobs.plex import sync_plex_servers_recently_added
from server.models.settings import (
    MediaProviderType,
    MediaServerLibrary,
    PlexSetting,
    RadarrSetting,
    SonarrSetting,
)
from server.models.users import User, UserRole
from server.repositories.settings import (
    PlexSettingRepository,
    RadarrSettingRepository,
    SonarrSettingRepository,
)
from server.schemas.core import ResponseMessage
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
#  All external services                 #
##########################################


@router.get("")
async def get_user_media_providers(
    provider_type: Optional[MediaProviderType] = None,
    current_user: User = Depends(deps.get_current_user),
):
    external_settings = current_user.media_providers
    if provider_type is not None:
        return [
            setting
            for setting in external_settings
            if setting.provider_type == provider_type and setting.enabled
        ]
    return external_settings


##########################################
# Plex                                   #
##########################################


@router.get(
    "/plex/servers",
    response_model=List[PlexServer],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex account linked"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_plex_account_servers(
    current_user: User = Depends(deps.get_current_user),
):
    if current_user.plex_api_key is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex account linked to the user.")
    servers = await plex.get_plex_account_servers(current_user.plex_api_key)
    return servers


@router.get(
    "/plex",
    response_model=List[PlexSettingSchema],
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_plex_settings(
    current_user: User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    settings = await plex_setting_repo.find_all_by(user_id=current_user.id)
    return settings


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
    current_user: User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
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
    setting = await plex_setting_repo.find_by(
        user_id=current_user.id, server_id=setting_in.server_id
    )
    if setting is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "This server is already added.")
    setting = setting_in.to_orm(PlexSetting)
    setting.user_id = current_user.id
    libraries = []
    for library in setting_in.libraries:
        if library.enabled:
            libraries.append(library.to_orm(MediaServerLibrary))
    setting.libraries = libraries

    await plex_setting_repo.save(setting)

    if setting.libraries:
        scheduler.add_job(sync_plex_servers_recently_added, args=[setting.server_id])

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
    current_user: User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    setting = await plex_setting_repo.find_by(user_id=current_user.id, id=setting_id)
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

    setting = await plex_setting_repo.update(setting, setting_in)

    return setting


@router.delete(
    "/plex/{setting_id}",
    response_model=ResponseMessage,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def delete_plex_setting(
    setting_id: str,
    current_user: User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    setting = await plex_setting_repo.find_by(user_id=current_user.id, id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")
    await plex_setting_repo.remove(setting)
    return {"detail": "Plex setting removed."}


@router.get(
    "/plex/{setting_id}/libraries",
    response_model=List[PlexLibrarySection],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Server connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_plex_libraries(
    setting_id: str,
    current_user: User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):

    setting = await plex_setting_repo.find_by(user_id=current_user.id, id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Plex setting for this server.")
    libraries = await plex.get_plex_server_library_sections(
        setting.host, setting.port, setting.ssl, setting.api_key
    )
    if libraries is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to get Plex libraries.")
    for library in libraries:
        library.enabled = any(int(l.library_id) == library.library_id for l in setting.libraries)
    return libraries


@router.patch(
    "/plex/{setting_id}/libraries",
    response_model=List[PlexLibrarySection],
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "No Plex setting"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def update_plex_setting_libraries(
    setting_id: str,
    libraries_in: List[PlexLibrarySection],
    current_user: User = Depends(deps.get_current_user),
    plex_setting_repo: PlexSettingRepository = Depends(deps.get_repository(PlexSettingRepository)),
):
    setting = await plex_setting_repo.find_by(user_id=current_user.id, id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plex setting not found.")

    for library_in in libraries_in:
        setting_library = next(
            (l for l in setting.libraries if int(l.library_id) == library_in.library_id), None
        )
        if setting_library is None and library_in.enabled:
            setting.libraries.append(library_in.to_orm(MediaServerLibrary))
        elif setting_library is not None and not library_in.enabled:
            setting.libraries.remove(setting_library)

    await plex_setting_repo.save(setting)
    if setting.libraries:
        scheduler.add_job(
            sync_plex_servers_recently_added,
            id="manual_plex_sync",
            run_date=datetime.now() + timedelta(seconds=10),
            args=[setting.server_id],
            max_instances=1,
            replace_existing=True,
        )

    return setting.libraries


##########################################
# Radarr                                 #
##########################################


@router.post(
    "/radarr/instance-info",
    response_model=RadarrInstanceInfo,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_radarr_instance_info(
    setting_in: ExternalServiceSettingBase,
):
    instance_info = await radarr.get_instance_info(
        setting_in.api_key, setting_in.host, setting_in.port, setting_in.ssl
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
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    setting = await radarr_setting_repo.find_by(id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr setting not found.")

    instance_info = await radarr.get_instance_info(
        setting.api_key, setting.host, setting.port, setting.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    return instance_info


@router.get(
    "/radarr",
    response_model=List[RadarrSettingSchema],
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_radarr_settings(
    current_user: User = Depends(deps.get_current_user),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    settings = await radarr_setting_repo.find_all_by(user_id=current_user.id)
    return settings


@router.post(
    "/radarr",
    status_code=status.HTTP_201_CREATED,
    response_model=RadarrSettingSchema,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def add_radarr_setting(
    setting_in: RadarrSettingCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    if not await radarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    setting = setting_in.to_orm(RadarrSetting)
    setting.user_id = current_user.id
    await radarr_setting_repo.save(setting)
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
    current_user: User = Depends(deps.get_current_user),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    setting = await radarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Radarr setting.")

    if not await radarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Radarr.")
    setting = await radarr_setting_repo.update(setting, setting_in)
    return setting


@router.delete(
    "/radarr/{setting_id}",
    response_model=ResponseMessage,
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Radarr setting"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def delete_radarr_setting(
    setting_id: str,
    current_user: User = Depends(deps.get_current_user),
    radarr_setting_repo: RadarrSettingRepository = Depends(
        deps.get_repository(RadarrSettingRepository)
    ),
):
    setting = await radarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Radarr setting not found.")
    await radarr_setting_repo.remove(setting)
    return {"detail": "Radarr setting removed."}


##########################################
# Sonarr                                 #
##########################################


@router.post(
    "/sonarr/instance-info",
    response_model=SonarrInstanceInfo,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_sonarr_instance_info(
    setting_in: ExternalServiceSettingBase,
):
    instance_info = await sonarr.get_instance_info(
        setting_in.api_key, setting_in.host, setting_in.port, setting_in.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")
    return instance_info


@router.get(
    "/sonarr/{setting_id}/instance-info",
    response_model=SonarrInstanceInfo,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Setting not found"},
        status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"},
    },
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_sonarr_setting_instance_info(
    setting_id: str,
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    setting = await sonarr_setting_repo.find_by(id=setting_id)
    if setting is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Setting not found.")
    instance_info = await sonarr.get_instance_info(
        setting.api_key, setting.host, setting.port, setting.ssl
    )
    if instance_info is None:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")
    return instance_info


@router.get(
    "/sonarr",
    response_model=List[SonarrSettingSchema],
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def get_sonarr_settings(
    current_user: User = Depends(deps.get_current_user),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    settings = await sonarr_setting_repo.find_all_by(user_id=current_user.id)
    return settings


@router.post(
    "/sonarr",
    status_code=status.HTTP_201_CREATED,
    response_model=SonarrSettingSchema,
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"description": "Instance connection fail"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def add_sonarr_setting(
    setting_in: SonarrSettingCreateUpdate,
    current_user: User = Depends(deps.get_current_user),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    if not await sonarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")
    setting = setting_in.to_orm(SonarrSetting)
    setting.user_id = current_user.id
    await sonarr_setting_repo.save(setting)
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
    current_user: User = Depends(deps.get_current_user),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    setting = await sonarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No existing Sonarr setting.")

    if not await sonarr.check_instance_status(
        api_key=setting_in.api_key,
        host=setting_in.host,
        port=setting_in.port,
        ssl=setting_in.ssl,
    ):
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Failed to connect to Sonarr.")

    setting = await sonarr_setting_repo.update(setting, setting_in)
    return setting


@router.delete(
    "/sonarr/{setting_id}",
    response_model=ResponseMessage,
    responses={status.HTTP_404_NOT_FOUND: {"description": "No Sonarr setting"}},
    dependencies=[Depends(deps.has_user_permissions([UserRole.manage_settings]))],
)
async def delete_sonarr_setting(
    setting_id: str,
    current_user: User = Depends(deps.get_current_user),
    sonarr_setting_repo: SonarrSettingRepository = Depends(
        deps.get_repository(SonarrSettingRepository)
    ),
):
    setting = await sonarr_setting_repo.find_by(id=setting_id)
    if setting is None or setting.user_id != current_user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Sonarr setting not found.")
    await sonarr_setting_repo.remove(setting)
    return {"detail": "Sonarr setting removed."}
